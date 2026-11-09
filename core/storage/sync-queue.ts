import { coalesceOperation } from '../domain/sync';
import { readJson, writeJson } from './json-storage';

export function createSyncQueue(storage: TKeyValueStorage, getUserId: () => string): TSyncQueue {
  const key = () => `sync:queue:${getUserId()}`;
  const getAll = () => readJson<TSyncOperation[]>(storage, key(), []);
  const write = (operations: TSyncOperation[]) => writeJson(storage, key(), operations);

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
