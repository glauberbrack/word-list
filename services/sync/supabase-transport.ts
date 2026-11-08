import type { SupabaseClient } from '@supabase/supabase-js';

import { SyncPermanentError } from '@/core/domain/sync';

const RETRYABLE_CLIENT_STATUSES = [408, 429];

function isPermanentStatus(status: number): boolean {
  return status >= 400 && status < 500 && !RETRYABLE_CLIENT_STATUSES.includes(status);
}

type TUpsertRow = Record<string, string | boolean>;

function toRow(operation: TSyncOperation, userId: string): { table: string; row: TUpsertRow } {
  const at = new Date(operation.at).toISOString();

  if (operation.entity === 'history') {
    return { table: 'history', row: { user_id: userId, word: operation.word, viewed_at: at } };
  }

  return {
    table: 'favorites',
    row: {
      user_id: userId,
      word: operation.word,
      updated_at: at,
      deleted: operation.type === 'delete',
    },
  };
}

export function createSupabaseSyncTransport(
  client: SupabaseClient,
  getUserId: () => string | null,
): TSyncTransport {
  return {
    async push(operation) {
      const userId = getUserId();
      if (!userId) throw new Error('Sem sessão para sincronizar');

      const { table, row } = toRow(operation, userId);
      const { error, status } = await client
        .from(table)
        .upsert(row, { onConflict: 'user_id,word' });

      if (!error) return;
      if (isPermanentStatus(status)) throw new SyncPermanentError(error.message);
      throw new Error(error.message);
    },
  };
}
