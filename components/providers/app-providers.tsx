import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense, useMemo, useState, type ReactNode } from 'react';

import { fetchDictionaryEntries } from '@/api/requests/dictionary';
import {
  createDictionaryCache,
  createDictionaryRepository,
  createSqliteKeyValueStorage,
  createWordsRepository,
  WORDS_DATABASE_ASSET,
  WORDS_DATABASE_NAME,
} from '@/core';
import { LoadingState } from '@/components/ui/loading-state';

import { RepositoriesProvider } from './repositories-provider';

const dictionaryRepository = createDictionaryRepository({
  cache: createDictionaryCache(createSqliteKeyValueStorage()),
  fetchEntries: fetchDictionaryEntries,
});

function SqliteRepositories({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const repositories = useMemo<TRepositories>(
    () => ({ words: createWordsRepository(db), dictionary: dictionaryRepository }),
    [db],
  );

  return <RepositoriesProvider repositories={repositories}>{children}</RepositoriesProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingState />}>
        <SQLiteProvider
          databaseName={WORDS_DATABASE_NAME}
          assetSource={{ assetId: WORDS_DATABASE_ASSET }}
          useSuspense
        >
          <SqliteRepositories>{children}</SqliteRepositories>
        </SQLiteProvider>
      </Suspense>
    </QueryClientProvider>
  );
}
