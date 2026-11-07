import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useWordList } from '@/hooks/use-word-list';
import { colors, spacing, typography } from '@/theme';

import { WordCell } from '../components/word-cell';

const COLUMNS = 3;

export function WordListScreen() {
  const { items, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWordList();

  const openWord = useCallback((entry: TWordEntry) => {
    router.push({ pathname: '/word/[word]', params: { word: entry.word, id: String(entry.id) } });
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <LoadingState />;
  if (isError) {
    return <ErrorState message="Não foi possível carregar as palavras." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word list</Text>
      <View style={styles.grid}>
        <FlashList
          data={items}
          numColumns={COLUMNS}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <WordCell entry={item} onPress={openWord} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} color={colors.primary} />
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  grid: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
