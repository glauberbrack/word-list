import type { SupabaseClient } from '@supabase/supabase-js';

type TFavoriteRow = {
  word: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};

type THistoryRow = {
  word: string;
  viewed_at: string;
};

export function createSupabaseRemoteUserData(client: SupabaseClient): TRemoteUserData {
  return {
    async fetchFavorites(userId) {
      const { data, error } = await client
        .from('favorites')
        .select('word, created_at, updated_at, deleted')
        .eq('user_id', userId);
      if (error) throw new Error(error.message);

      return Object.fromEntries(
        (data as TFavoriteRow[]).map((row) => [
          row.word,
          {
            word: row.word,
            createdAt: Date.parse(row.created_at),
            updatedAt: Date.parse(row.updated_at),
            deleted: row.deleted,
          },
        ]),
      );
    },
    async fetchHistory(userId) {
      const { data, error } = await client
        .from('history')
        .select('word, viewed_at')
        .eq('user_id', userId);
      if (error) throw new Error(error.message);

      return Object.fromEntries(
        (data as THistoryRow[]).map((row) => [
          row.word,
          { word: row.word, viewedAt: Date.parse(row.viewed_at) },
        ]),
      );
    },
  };
}
