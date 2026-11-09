import { buildSyncOperation } from '@/test/fixtures';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { createSyncQueue } from '../sync-queue';

describe('createSyncQueue', () => {
  it('persiste as operações e junta as da mesma palavra', () => {
    const { storage } = createMemoryKeyValueStorage();
    const queue = createSyncQueue(storage, () => 'local');

    queue.enqueue(buildSyncOperation({ id: 'favorite:hello:1', type: 'upsert' }));
    queue.enqueue(buildSyncOperation({ id: 'favorite:hello:2', type: 'delete' }));

    expect(createSyncQueue(storage, () => 'local').getAll()).toEqual([
      buildSyncOperation({ id: 'favorite:hello:2', type: 'delete' }),
    ]);
  });

  it('atualiza e remove pelo id', () => {
    const { storage } = createMemoryKeyValueStorage();
    const queue = createSyncQueue(storage, () => 'local');
    const operation = buildSyncOperation();

    queue.enqueue(operation);
    queue.update({ ...operation, attempts: 3 });
    expect(queue.getAll()[0]?.attempts).toBe(3);

    queue.remove(operation.id);
    expect(queue.getAll()).toEqual([]);
  });

  it('separa a fila por usuário e segue o usuário ativo', () => {
    const { storage } = createMemoryKeyValueStorage();
    let userId = 'user-a';
    const queue = createSyncQueue(storage, () => userId);

    queue.enqueue(buildSyncOperation({ id: 'favorite:hello:1' }));
    userId = 'user-b';

    expect(queue.getAll()).toEqual([]);
    expect(createSyncQueue(storage, () => 'user-a').getAll()).toHaveLength(1);
  });
});
