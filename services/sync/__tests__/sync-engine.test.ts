import { SyncPermanentError } from '@/core/domain/sync';
import { createSyncQueue } from '@/core/storage/sync-queue';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { createSyncEngine, SYNC_DEBOUNCE_MS } from '../sync-engine';

function setup(push: jest.Mock) {
  const { storage } = createMemoryKeyValueStorage();
  const queue = createSyncQueue(storage);
  const onPermanentFailure = jest.fn();
  const engine = createSyncEngine({
    queue,
    transport: { push },
    onPermanentFailure,
    now: () => Date.now(),
  });

  return { engine, queue, onPermanentFailure };
}

const favorite = (word: string, type: TSyncOperationType = 'upsert'): TSyncOperationInput => ({
  entity: 'favorite',
  type,
  word,
  at: Date.now(),
});

describe('createSyncEngine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(10_000);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('envia após o debounce e esvazia a fila', async () => {
    const push = jest.fn().mockResolvedValue(undefined);
    const { engine, queue } = setup(push);

    engine.enqueue(favorite('hello'));
    expect(push).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);

    expect(push).toHaveBeenCalledTimes(1);
    expect(queue.getAll()).toEqual([]);
  });

  it('envia uma operação só quando a palavra muda várias vezes antes do envio', async () => {
    const push = jest.fn().mockResolvedValue(undefined);
    const { engine } = setup(push);

    engine.enqueue(favorite('hello', 'upsert'));
    jest.setSystemTime(10_001);
    engine.enqueue(favorite('hello', 'delete'));
    await jest.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);

    expect(push).toHaveBeenCalledTimes(1);
    expect(push.mock.calls[0]?.[0]).toMatchObject({ word: 'hello', type: 'delete' });
  });

  it('mantém a operação na fila e tenta de novo depois de erro de rede', async () => {
    const push = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValue(undefined);
    const { engine, queue } = setup(push);

    engine.enqueue(favorite('hello'));
    await jest.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);

    expect(queue.getAll()).toHaveLength(1);
    expect(queue.getAll()[0]?.attempts).toBe(1);

    await jest.advanceTimersByTimeAsync(1_000);

    expect(push).toHaveBeenCalledTimes(2);
    expect(queue.getAll()).toEqual([]);
  });

  it('para no primeiro erro de rede sem tentar o resto da fila', async () => {
    const push = jest.fn().mockRejectedValue(new Error('Network Error'));
    const { engine, queue } = setup(push);

    engine.enqueue(favorite('hello'));
    engine.enqueue(favorite('world'));
    await jest.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);

    expect(push).toHaveBeenCalledTimes(1);
    expect(queue.getAll()).toHaveLength(2);
  });

  it('descarta e avisa quando o servidor recusa de vez', async () => {
    const push = jest.fn().mockRejectedValue(new SyncPermanentError('forbidden'));
    const { engine, queue, onPermanentFailure } = setup(push);

    engine.enqueue(favorite('hello'));
    await jest.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);

    expect(queue.getAll()).toEqual([]);
    expect(onPermanentFailure).toHaveBeenCalledWith(expect.objectContaining({ word: 'hello' }));
  });
});
