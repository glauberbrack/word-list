import type { SQLiteDatabase } from 'expo-sqlite';

import { getNextCursor } from '../domain/pagination';

export function createWordsRepository(db: SQLiteDatabase): TWordsRepository {
  return {
    async getPage({ cursor, limit }) {
      const items = await db.getAllAsync<TWordEntry>(
        'SELECT id, word FROM words WHERE id > ? ORDER BY id LIMIT ?',
        [cursor ?? 0, limit],
      );

      return { items, nextCursor: getNextCursor(items, limit) };
    },
  };
}
