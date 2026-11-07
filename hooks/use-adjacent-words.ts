import { useQuery } from '@tanstack/react-query';

import { useRepositories } from './use-repositories';

export function useAdjacentWords(id: number | null) {
  const { words } = useRepositories();

  return useQuery({
    queryKey: ['adjacent-words', id],
    queryFn: async () => {
      const [previous, next] = await Promise.all([
        words.getAdjacent(id ?? 0, 'previous'),
        words.getAdjacent(id ?? 0, 'next'),
      ]);

      return { previous, next };
    },
    enabled: id !== null,
    staleTime: Infinity,
  });
}
