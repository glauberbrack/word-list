import type { UseQueryResult } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/ui/error-state';
import { colors, spacing, typography } from '@/theme';

import { MeaningsList } from './meanings-list';

type TWordDetailBodyProps = {
  word: string;
  query: UseQueryResult<TDictionaryLookup>;
};

export function WordDetailBody({ word, query }: TWordDetailBodyProps) {
  if (query.isPending) {
    return <ActivityIndicator style={styles.loading} color={colors.primary} />;
  }

  if (query.isError) {
    return (
      <View style={styles.state}>
        <ErrorState
          message="Não foi possível buscar esta palavra. Confira sua conexão."
          onRetry={() => void query.refetch()}
        />
      </View>
    );
  }

  if (query.data.status === 'not_found') {
    return (
      <View style={styles.state}>
        <Text style={styles.message}>
          Nenhuma definição encontrada para “{word}” na Free Dictionary API.
        </Text>
      </View>
    );
  }

  return <MeaningsList meanings={query.data.detail.meanings} />;
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: spacing.xl,
  },
  state: {
    paddingVertical: spacing.lg,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
