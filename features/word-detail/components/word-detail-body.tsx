import type { UseQueryResult } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/ui/error-state';
import { colors, radius, shadows, spacing, typography } from '@/theme';

import { MeaningsAccordion } from './meanings-accordion';

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
      <View style={styles.card}>
        <ErrorState
          message="Não foi possível buscar esta palavra. Confira sua conexão."
          onRetry={() => void query.refetch()}
        />
      </View>
    );
  }

  if (query.data.status === 'not_found') {
    return (
      <View style={styles.card}>
        <Text style={styles.message}>
          Nenhuma definição encontrada para “{word}” na Free Dictionary API.
        </Text>
      </View>
    );
  }

  return <MeaningsAccordion meanings={query.data.detail.meanings} />;
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: spacing.xl,
  },
  card: {
    padding: spacing.lg - 2,
    borderRadius: radius.lg + 2,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  message: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
