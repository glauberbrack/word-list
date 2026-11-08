import { LOCAL_USER_ID } from '@/constants/user';
import {
  favoritesToUpload,
  historyToUpload,
  mergeFavorites,
  mergeHistory,
} from '@/core/domain/reconcile';
import { createFavoritesRepository } from '@/core/storage/favorites.repository';
import { createHistoryRepository } from '@/core/storage/history.repository';

import type { TSwitchableTransport } from '../sync/switchable-transport';

export type TSessionDeps = {
  storage: TKeyValueStorage;
  sync: Pick<TSyncEngine, 'enqueue'>;
  transport: TSwitchableTransport;
  localTransport: TSyncTransport;
  remoteTransport: TSyncTransport | null;
  remote: TRemoteUserData | null;
  hydrate: (userId: string) => void;
};

async function fetchRemote(remote: TRemoteUserData, userId: string) {
  try {
    const [favorites, history] = await Promise.all([
      remote.fetchFavorites(userId),
      remote.fetchHistory(userId),
    ]);
    return { favorites, history };
  } catch {
    return { favorites: {}, history: {} };
  }
}

export async function activateSession(user: TAuthUser | null, deps: TSessionDeps) {
  if (!user || !deps.remote || !deps.remoteTransport) {
    deps.transport.use(deps.localTransport);
    deps.hydrate(LOCAL_USER_ID);
    return;
  }

  const guestFavorites = createFavoritesRepository(deps.storage, LOCAL_USER_ID);
  const guestHistory = createHistoryRepository(deps.storage, LOCAL_USER_ID);
  const userFavorites = createFavoritesRepository(deps.storage, user.id);
  const userHistory = createHistoryRepository(deps.storage, user.id);
  const remote = await fetchRemote(deps.remote, user.id);

  const favorites = mergeFavorites(
    remote.favorites,
    userFavorites.getAll(),
    guestFavorites.getAll(),
  );
  const history = mergeHistory(remote.history, userHistory.getAll(), guestHistory.getAll());

  userFavorites.replaceAll(favorites);
  userHistory.replaceAll(history);
  guestFavorites.replaceAll({});
  guestHistory.replaceAll({});

  deps.transport.use(deps.remoteTransport);
  deps.hydrate(user.id);

  for (const operation of [
    ...favoritesToUpload(favorites, remote.favorites),
    ...historyToUpload(history, remote.history),
  ]) {
    deps.sync.enqueue(operation);
  }
}
