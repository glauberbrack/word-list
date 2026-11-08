import { readJson, writeJson } from './json-storage';

export function createHistoryRepository(
  storage: TKeyValueStorage,
  userId: string,
): THistoryRepository {
  const key = `history:${userId}`;
  const getAll = () => readJson<Record<string, THistoryItem>>(storage, key, {});

  return {
    getAll,
    save(item) {
      writeJson(storage, key, { ...getAll(), [item.word]: item });
    },
    replaceAll(items) {
      writeJson(storage, key, items);
    },
  };
}
