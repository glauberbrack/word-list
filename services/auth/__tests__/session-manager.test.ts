import { LOCAL_USER_ID } from '@/constants/user';
import { createFavoritesRepository } from '@/core/storage/favorites.repository';
import { createHistoryRepository } from '@/core/storage/history.repository';
import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { createLocalOnlyTransport } from '../../sync/local-transport';
import { createSwitchableTransport } from '../../sync/switchable-transport';
import { activateSession } from '../session-manager';

const user: TAuthUser = { id: 'user-1', email: 'ana@example.com' };

function setup(remoteData: Partial<TRemoteUserData> = {}) {
  const { storage } = createMemoryKeyValueStorage();
  const localTransport = createLocalOnlyTransport();
  const remoteTransport: TSyncTransport = { push: jest.fn() };
  const transport = createSwitchableTransport(localTransport);
  const use = jest.spyOn(transport, 'use');
  const enqueue = jest.fn();
  const hydrate = jest.fn();
  const remote: TRemoteUserData = {
    fetchFavorites: jest.fn().mockResolvedValue({}),
    fetchHistory: jest.fn().mockResolvedValue({}),
    ...remoteData,
  };

  const deps = {
    storage,
    sync: { enqueue },
    transport,
    localTransport,
    remoteTransport,
    remote,
    hydrate,
  };

  return { deps, storage, use, enqueue, hydrate, localTransport, remoteTransport };
}

describe('activateSession', () => {
  it('sem usuário, usa os dados locais e não envia nada ao servidor', async () => {
    const { deps, use, hydrate, localTransport } = setup();

    await activateSession(null, deps);

    expect(use).toHaveBeenCalledWith(localTransport);
    expect(hydrate).toHaveBeenCalledWith(LOCAL_USER_ID);
  });

  it('no login, junta favoritos do visitante com os do servidor e envia o que falta', async () => {
    const { deps, storage, enqueue, hydrate, use, remoteTransport } = setup({
      fetchFavorites: jest.fn().mockResolvedValue({
        remote: { word: 'remote', createdAt: 1, updatedAt: 1, deleted: false },
      }),
    });
    createFavoritesRepository(storage, LOCAL_USER_ID).save({
      word: 'guest',
      createdAt: 5,
      updatedAt: 5,
      deleted: false,
    });
    createHistoryRepository(storage, LOCAL_USER_ID).save({ word: 'guest', viewedAt: 6 });

    await activateSession(user, deps);

    expect(Object.keys(createFavoritesRepository(storage, user.id).getAll()).sort()).toEqual([
      'guest',
      'remote',
    ]);
    expect(createFavoritesRepository(storage, LOCAL_USER_ID).getAll()).toEqual({});
    expect(use).toHaveBeenLastCalledWith(remoteTransport);
    expect(hydrate).toHaveBeenCalledWith(user.id);
    expect(enqueue).toHaveBeenCalledWith({
      entity: 'favorite',
      type: 'upsert',
      word: 'guest',
      at: 5,
    });
    expect(enqueue).toHaveBeenCalledWith({
      entity: 'history',
      type: 'upsert',
      word: 'guest',
      at: 6,
    });
    expect(enqueue).toHaveBeenCalledTimes(2);
  });

  it('sem rede no login, mantém os dados locais e envia tudo depois', async () => {
    const { deps, storage, enqueue } = setup({
      fetchFavorites: jest.fn().mockRejectedValue(new Error('offline')),
    });
    createFavoritesRepository(storage, LOCAL_USER_ID).save({
      word: 'guest',
      createdAt: 5,
      updatedAt: 5,
      deleted: false,
    });

    await activateSession(user, deps);

    expect(createFavoritesRepository(storage, user.id).getAll().guest).toBeDefined();
    expect(enqueue).toHaveBeenCalledWith(expect.objectContaining({ word: 'guest' }));
  });
});
