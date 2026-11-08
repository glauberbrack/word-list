import type { SupabaseClient } from '@supabase/supabase-js';

import { SyncPermanentError } from '@/core/domain/sync';
import { buildSyncOperation } from '@/test/fixtures';

import { createSupabaseSyncTransport } from '../supabase-transport';

function fakeClient(response: { error: { message: string } | null; status: number }) {
  const upsert = jest.fn().mockResolvedValue(response);
  const from = jest.fn(() => ({ upsert }));

  return { client: { from } as unknown as SupabaseClient, from, upsert };
}

describe('createSupabaseSyncTransport', () => {
  it('grava o favorito do usuário com upsert por usuário e palavra', async () => {
    const { client, from, upsert } = fakeClient({ error: null, status: 201 });
    const transport = createSupabaseSyncTransport(client, () => 'user-1');

    await transport.push(buildSyncOperation({ type: 'delete', at: 0 }));

    expect(from).toHaveBeenCalledWith('favorites');
    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        word: 'hello',
        updated_at: '1970-01-01T00:00:00.000Z',
        deleted: true,
      },
      { onConflict: 'user_id,word' },
    );
  });

  it('grava a visualização no histórico', async () => {
    const { client, from, upsert } = fakeClient({ error: null, status: 201 });
    const transport = createSupabaseSyncTransport(client, () => 'user-1');

    await transport.push(buildSyncOperation({ entity: 'history', at: 0 }));

    expect(from).toHaveBeenCalledWith('history');
    expect(upsert.mock.calls[0]?.[0]).toEqual({
      user_id: 'user-1',
      word: 'hello',
      viewed_at: '1970-01-01T00:00:00.000Z',
    });
  });

  it('trata 4xx como recusa definitiva', async () => {
    const { client } = fakeClient({ error: { message: 'forbidden' }, status: 403 });
    const transport = createSupabaseSyncTransport(client, () => 'user-1');

    await expect(transport.push(buildSyncOperation())).rejects.toBeInstanceOf(SyncPermanentError);
  });

  it('trata 5xx, 429 e falha de rede como erro temporário', async () => {
    for (const status of [500, 429, 0]) {
      const { client } = fakeClient({ error: { message: 'oops' }, status });
      const transport = createSupabaseSyncTransport(client, () => 'user-1');
      const push = transport.push(buildSyncOperation());

      await expect(push).rejects.toThrow('oops');
      await expect(push).rejects.not.toBeInstanceOf(SyncPermanentError);
    }
  });

  it('não envia sem usuário logado', async () => {
    const { client, upsert } = fakeClient({ error: null, status: 201 });
    const transport = createSupabaseSyncTransport(client, () => null);

    await expect(transport.push(buildSyncOperation())).rejects.toThrow();
    expect(upsert).not.toHaveBeenCalled();
  });
});
