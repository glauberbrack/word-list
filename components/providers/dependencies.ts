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
import { createFakeSyncTransport, createSyncEngine } from '@/services/sync';
import { useFavoritesStore } from '@/store/favorites.store';
import { useHistoryStore } from '@/store/history.store';

const keyValueStorage = createSqliteKeyValueStorage();

export const dictionaryRepository = createDictionaryRepository({
  cache: createDictionaryCache(keyValueStorage),
  fetchEntries: fetchDictionaryEntries,
});

export const syncEngine = createSyncEngine({
  queue: createSyncQueue(keyValueStorage),
  transport: createFakeSyncTransport(),
  onPermanentFailure(operation) {
    if (operation.entity === 'favorite') useFavoritesStore.getState().revert(operation.word);
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
