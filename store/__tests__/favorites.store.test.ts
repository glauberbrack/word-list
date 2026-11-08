import { createFavoritesRepository } from '@/core/storage/favorites.repository';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { useFavoritesStore } from '../favorites.store';

function setup() {
  const { storage } = createMemoryKeyValueStorage();
  const repository = createFavoritesRepository(storage, 'local');
  const enqueue = jest.fn();
  let now = 100;

  useFavoritesStore.getState().hydrate({ repository, sync: { enqueue }, now: () => now++ });

  return { repository, enqueue };
}

describe('useFavoritesStore', () => {
  it('atualiza a tela, grava localmente e enfileira o envio no mesmo toque', () => {
    const { repository, enqueue } = setup();

    useFavoritesStore.getState().toggle('hello');

    expect(useFavoritesStore.getState().items.hello?.deleted).toBe(false);
    expect(repository.getAll().hello?.deleted).toBe(false);
    expect(enqueue).toHaveBeenCalledWith({
      entity: 'favorite',
      type: 'upsert',
      word: 'hello',
      at: 100,
    });
  });

  it('enfileira delete ao desfavoritar', () => {
    const { enqueue } = setup();

    useFavoritesStore.getState().toggle('hello');
    useFavoritesStore.getState().toggle('hello');

    expect(useFavoritesStore.getState().items.hello?.deleted).toBe(true);
    expect(enqueue).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'delete' }));
  });

  it('reverte sem enfileirar nada quando o servidor recusa', () => {
    const { repository, enqueue } = setup();

    useFavoritesStore.getState().toggle('hello');
    useFavoritesStore.getState().revert('hello');

    expect(useFavoritesStore.getState().items.hello?.deleted).toBe(true);
    expect(repository.getAll().hello?.deleted).toBe(true);
    expect(enqueue).toHaveBeenCalledTimes(1);
  });

  it('carrega os favoritos salvos ao hidratar', () => {
    const { storage } = createMemoryKeyValueStorage();
    const repository = createFavoritesRepository(storage, 'local');
    repository.save({ word: 'saved', createdAt: 1, updatedAt: 1, deleted: false });

    useFavoritesStore.getState().hydrate({ repository, sync: { enqueue: jest.fn() } });

    expect(Object.keys(useFavoritesStore.getState().items)).toEqual(['saved']);
  });
});
