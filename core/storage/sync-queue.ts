import { coalesceOperation } from '../domain/sync';
import { readJson, writeJson } from './json-storage';

const QUEUE_KEY = 'sync:queue';

export function createSyncQueue(storage: TKeyValueStorage): TSyncQueue {
  const getAll = () => readJson<TSyncOperation[]>(storage, QUEUE_KEY, []);
  const write = (operations: TSyncOperation[]) => writeJson(storage, QUEUE_KEY, operations);

  return {
    getAll,
    enqueue(operation) {
      write(coalesceOperation(getAll(), operation));
    },
    update(operation) {
      write(getAll().map((item) => (item.id === operation.id ? operation : item)));
    },
    remove(id) {
      write(getAll().filter((item) => item.id !== id));
    },
  };
}
