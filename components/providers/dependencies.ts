import { fetchDictionaryEntries } from '@/api/requests/dictionary';
import { LOCAL_USER_ID } from '@/constants/user';
import {
  createDictionaryCache,
  createDictionaryRepository,
  createFavoritesRepository,
  createHistoryRepository,
  createSqliteKeyValueStorage,
  createSyncQueue,
} from '@/core';
import { createSupabaseAuthGateway } from '@/lib/supabase/auth-gateway';
import { createSupabaseClient } from '@/lib/supabase/client';
import { createSupabaseRemoteUserData } from '@/lib/supabase/remote-user-data';
import { activateSession } from '@/services/auth/session-manager';
import {
  createLocalOnlyTransport,
  createSupabaseSyncTransport,
  createSwitchableTransport,
  createSyncEngine,
} from '@/services/sync';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useHistoryStore } from '@/store/history.store';
import { useToastStore } from '@/store/toast.store';

const keyValueStorage = createSqliteKeyValueStorage();
const supabase = createSupabaseClient();
const authGateway = supabase ? createSupabaseAuthGateway(supabase) : null;
const remoteUserData = supabase ? createSupabaseRemoteUserData(supabase) : null;
const localTransport = createLocalOnlyTransport();
const transport = createSwitchableTransport(localTransport);
const remoteTransport = supabase
  ? createSupabaseSyncTransport(supabase, () => useAuthStore.getState().user?.id ?? null)
  : null;

export const dictionaryRepository = createDictionaryRepository({
  cache: createDictionaryCache(keyValueStorage),
  fetchEntries: fetchDictionaryEntries,
});

export const syncEngine = createSyncEngine({
  queue: createSyncQueue(keyValueStorage),
  transport,
  onPermanentFailure(operation) {
    if (operation.entity !== 'favorite') return;

    useFavoritesStore.getState().revert(operation.word);
    useToastStore.getState().show(`Não foi possível salvar “${operation.word}” nos favoritos.`);
  },
});

export function hydrateUserStores(userId = LOCAL_USER_ID) {
  useFavoritesStore.getState().hydrate({
    repository: createFavoritesRepository(keyValueStorage, userId),
    sync: syncEngine,
  });
  useHistoryStore.getState().hydrate({
    repository: createHistoryRepository(keyValueStorage, userId),
    sync: syncEngine,
  });
}

function activateUserSession(user: TAuthUser | null) {
  return activateSession(user, {
    storage: keyValueStorage,
    sync: syncEngine,
    transport,
    localTransport,
    remoteTransport,
    remote: remoteUserData,
    hydrate: hydrateUserStores,
  });
}

export function startAuth(): () => void {
  useAuthStore.getState().configure({
    gateway: authGateway,
    beforeSignOut: () => syncEngine.flush(),
  });
  if (!authGateway) return () => undefined;

  let activeUserId: string | null | undefined;

  return authGateway.onAuthChange((user) => {
    useAuthStore.getState().setUser(user);
    if (user?.id === activeUserId) return;

    activeUserId = user?.id ?? null;
    void activateUserSession(user).then(() => syncEngine.flush());
  });
}
