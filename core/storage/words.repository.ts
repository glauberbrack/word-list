import type { SQLiteDatabase } from 'expo-sqlite';

import { getNextCursor } from '../domain/pagination';

const ADJACENT_QUERIES: Record<TWordDirection, string> = {
  previous: 'SELECT id, word FROM words WHERE id < ? ORDER BY id DESC LIMIT 1',
  next: 'SELECT id, word FROM words WHERE id > ? ORDER BY id ASC LIMIT 1',
};

export function createWordsRepository(db: SQLiteDatabase): TWordsRepository {
  return {
    async getPage({ cursor, limit }) {
      const items = await db.getAllAsync<TWordEntry>(
        'SELECT id, word FROM words WHERE id > ? ORDER BY id LIMIT ?',
        [cursor ?? 0, limit],
      );

      return { items, nextCursor: getNextCursor(items, limit) };
    },
    getAdjacent(id, direction) {
      return db.getFirstAsync<TWordEntry>(ADJACENT_QUERIES[direction], [id]);
    },
  };
}
