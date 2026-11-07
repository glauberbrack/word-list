import { SQLiteStorage } from 'expo-sqlite/kv-store';

export const KV_DATABASE_NAME = 'word-list-kv.db';

export function createSqliteKeyValueStorage(databaseName = KV_DATABASE_NAME): TKeyValueStorage {
  const storage = new SQLiteStorage(databaseName);

  return {
    getItem: (key) => storage.getItemSync(key),
    setItem: (key, value) => storage.setItemSync(key, value),
    removeItem: (key) => {
      storage.removeItemSync(key);
    },
  };
}
