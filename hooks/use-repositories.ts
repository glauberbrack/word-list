import { useContext } from 'react';

import { RepositoriesContext } from '@/components/providers/repositories-provider';

export function useRepositories(): TRepositories {
  const repositories = useContext(RepositoriesContext);
  if (!repositories)
    throw new Error('useRepositories precisa estar dentro de RepositoriesProvider');

  return repositories;
}
