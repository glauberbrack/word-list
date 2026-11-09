import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { WordGrid } from '@/components/word-grid/word-grid';
import { openWordDetail } from '@/features/word-detail/actions/open-word-detail';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useActiveFavorites, useToggleFavorite } from '@/hooks/use-favorites';
import { colors, spacing, typography } from '@/theme';
import { formatRelativeTime } from '@/utils/format/relative-time';

export function FavoritesScreen() {
  const favorites = useActiveFavorites();
  const toggleFavorite = useToggleFavorite();
  const now = useCurrentTime();

  const items = useMemo<TWordGridItem[]>(
    () =>
      favorites.map((favorite) => ({
        key: favorite.word,
        word: favorite.word,
        caption: `salva ${formatRelativeTime(favorite.createdAt, now)}`,
      })),
    [favorites, now],
  );

  const openWord = useCallback((item: TWordGridItem) => openWordDetail(item, 'favorites'), []);
  const removeWord = useCallback(
    (item: TWordGridItem) => toggleFavorite(item.word),
    [toggleFavorite],
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Toque na estrela de uma palavra para salvá-la aqui."
        />
      ) : (
        <>
          <Text style={styles.hint}>Toque longo em uma palavra para remover.</Text>
          <WordGrid items={items} onPressItem={openWord} onLongPressItem={removeWord} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    paddingBottom: spacing.sm,
  },
});
