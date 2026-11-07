import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useRepositories } from './use-repositories';

const DETAIL_GC_TIME_MS = 30 * 60 * 1000;

function wordDetailQuery(dictionary: TDictionaryRepository, word: string) {
  return queryOptions({
    queryKey: ['word-detail', word],
    queryFn: ({ signal }) => dictionary.getWord(word, signal),
    staleTime: Infinity,
    gcTime: DETAIL_GC_TIME_MS,
    retry: 1,
  });
}

export function useWordDetail(word: string) {
  const { dictionary } = useRepositories();

  return useQuery(wordDetailQuery(dictionary, word));
}

export function usePrefetchWordDetail() {
  const { dictionary } = useRepositories();
  const queryClient = useQueryClient();

  return useCallback(
    (word: string) => queryClient.prefetchQuery(wordDetailQuery(dictionary, word)),
    [dictionary, queryClient],
  );
}
