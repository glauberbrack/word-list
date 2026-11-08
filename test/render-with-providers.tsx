import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

import { RepositoriesProvider } from '@/components/providers/repositories-provider';

const activeClients = new Set<QueryClient>();

export async function clearQueryClients() {
  await Promise.all([...activeClients].map((client) => client.cancelQueries()));
  activeClients.forEach((client) => client.clear());
  activeClients.clear();
}

export function renderWithProviders(ui: ReactElement, repositories: TRepositories) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  activeClients.add(queryClient);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <RepositoriesProvider repositories={repositories}>{children}</RepositoriesProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
