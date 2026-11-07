import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { WORDS_PAGE_SIZE } from '@/core';

import { useRepositories } from './use-repositories';

export function useWordList() {
  const { words } = useRepositories();

  const query = useInfiniteQuery({
    queryKey: ['words'],
    queryFn: ({ pageParam }) => words.getPage({ cursor: pageParam, limit: WORDS_PAGE_SIZE }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return { ...query, items };
}
