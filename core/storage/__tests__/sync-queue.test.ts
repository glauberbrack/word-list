import { buildSyncOperation } from '@/test/fixtures';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { createSyncQueue } from '../sync-queue';

describe('createSyncQueue', () => {
  it('persiste as operações e junta as da mesma palavra', () => {
    const { storage } = createMemoryKeyValueStorage();
    const queue = createSyncQueue(storage);

    queue.enqueue(buildSyncOperation({ id: 'favorite:hello:1', type: 'upsert' }));
    queue.enqueue(buildSyncOperation({ id: 'favorite:hello:2', type: 'delete' }));

    expect(createSyncQueue(storage).getAll()).toEqual([
      buildSyncOperation({ id: 'favorite:hello:2', type: 'delete' }),
    ]);
  });

  it('atualiza e remove pelo id', () => {
    const { storage } = createMemoryKeyValueStorage();
    const queue = createSyncQueue(storage);
    const operation = buildSyncOperation();

    queue.enqueue(operation);
    queue.update({ ...operation, attempts: 3 });
    expect(queue.getAll()[0]?.attempts).toBe(3);

    queue.remove(operation.id);
    expect(queue.getAll()).toEqual([]);
  });
});
