import { createContext, type ReactNode } from 'react';

export const RepositoriesContext = createContext<TRepositories | null>(null);

type TRepositoriesProviderProps = {
  repositories: TRepositories;
  children: ReactNode;
};

export function RepositoriesProvider({ repositories, children }: TRepositoriesProviderProps) {
  return (
    <RepositoriesContext.Provider value={repositories}>{children}</RepositoriesContext.Provider>
  );
}
