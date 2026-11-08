import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';
import { helloEntries } from '@/test/fixtures';

import { FOUND_CACHE_TTL_MS } from '../../domain/dictionary';
import { createDictionaryCache } from '../dictionary-cache';
import { createDictionaryRepository } from '../dictionary.repository';

function setup(now = 1_000) {
  const { storage, data } = createMemoryKeyValueStorage();
  const fetchEntries = jest.fn();
  const clock = { now };
  const repository = createDictionaryRepository({
    cache: createDictionaryCache(storage),
    fetchEntries,
    now: () => clock.now,
  });

  return { repository, fetchEntries, data, clock };
}

describe('createDictionaryRepository', () => {
  it('busca na API e grava no cache na primeira vez', async () => {
    const { repository, fetchEntries, data } = setup();
    fetchEntries.mockResolvedValue(helloEntries);

    const lookup = await repository.getWord('hello');

    expect(lookup.status).toBe('found');
    expect(fetchEntries).toHaveBeenCalledTimes(1);
    expect(data.has('dict:hello')).toBe(true);
  });

  it('não chama a API de novo enquanto o cache está válido', async () => {
    const { repository, fetchEntries } = setup();
    fetchEntries.mockResolvedValue(helloEntries);

    await repository.getWord('hello');
    await repository.getWord('hello');

    expect(fetchEntries).toHaveBeenCalledTimes(1);
  });

  it('busca de novo quando o cache venceu', async () => {
    const { repository, fetchEntries, clock } = setup();
    fetchEntries.mockResolvedValue(helloEntries);

    await repository.getWord('hello');
    clock.now += FOUND_CACHE_TTL_MS;
    await repository.getWord('hello');

    expect(fetchEntries).toHaveBeenCalledTimes(2);
  });

  it('guarda o 404 no cache para não repetir a requisição', async () => {
    const { repository, fetchEntries } = setup();
    fetchEntries.mockResolvedValue(null);

    expect(await repository.getWord('aalii')).toEqual({ status: 'not_found' });
    expect(await repository.getWord('aalii')).toEqual({ status: 'not_found' });
    expect(fetchEntries).toHaveBeenCalledTimes(1);
  });

  it('propaga erro de rede sem gravar no cache', async () => {
    const { repository, fetchEntries, data } = setup();
    fetchEntries.mockRejectedValue(new Error('Network Error'));

    await expect(repository.getWord('hello')).rejects.toThrow('Network Error');
    expect(data.has('dict:hello')).toBe(false);
  });

  it('ignora entrada corrompida no cache e busca de novo', async () => {
    const { repository, fetchEntries, data } = setup();
    data.set('dict:hello', '{invalid');
    fetchEntries.mockResolvedValue(helloEntries);

    await repository.getWord('hello');

    expect(fetchEntries).toHaveBeenCalledTimes(1);
  });
});
