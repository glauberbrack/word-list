import { useQuery } from '@tanstack/react-query';

import { useRepositories } from './use-repositories';

export function useWordCount() {
  const { words } = useRepositories();

  return useQuery({
    queryKey: ['word-count'],
    queryFn: () => words.count(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
