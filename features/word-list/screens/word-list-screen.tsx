import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { WordGrid } from '@/components/word-grid/word-grid';
import { openWordDetail } from '@/features/word-detail/actions/open-word-detail';
import { useWordList } from '@/hooks/use-word-list';
import { colors, spacing } from '@/theme';

export function WordListScreen() {
  const { items, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWordList();

  const gridItems = useMemo<TWordGridItem[]>(
    () => items.map((entry) => ({ key: String(entry.id), word: entry.word, id: entry.id })),
    [items],
  );

  const openWord = useCallback((item: TWordGridItem) => openWordDetail(item, 'list'), []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <LoadingState />;
  if (isError) {
    return <ErrorState message="Não foi possível carregar as palavras." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <WordGrid
        items={gridItems}
        onPressItem={openWord}
        onEndReached={loadMore}
        footer={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color={colors.primary} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
