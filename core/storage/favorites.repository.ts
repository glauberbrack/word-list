import { readJson, writeJson } from './json-storage';

export function createFavoritesRepository(
  storage: TKeyValueStorage,
  userId: string,
): TFavoritesRepository {
  const key = `favorites:${userId}`;
  const getAll = () => readJson<Record<string, TFavorite>>(storage, key, {});

  return {
    getAll,
    save(item) {
      writeJson(storage, key, { ...getAll(), [item.word]: item });
    },
  };
}
