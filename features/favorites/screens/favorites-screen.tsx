import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AccountButton } from '@/components/account/account-button';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenTitle } from '@/components/ui/screen-title';
import { WordGrid } from '@/components/word-grid/word-grid';
import { openWordDetail } from '@/features/word-detail/actions/open-word-detail';
import { useFavoriteWords, useToggleFavorite } from '@/hooks/use-favorites';
import { colors, spacing, typography } from '@/theme';

export function FavoritesScreen() {
  const words = useFavoriteWords();
  const toggleFavorite = useToggleFavorite();
  const items = useMemo<TWordGridItem[]>(() => words.map((word) => ({ key: word, word })), [words]);

  const openWord = useCallback((item: TWordGridItem) => openWordDetail(item, 'favorites'), []);
  const removeWord = useCallback(
    (item: TWordGridItem) => toggleFavorite(item.word),
    [toggleFavorite],
  );

  return (
    <View style={styles.container}>
      <ScreenTitle action={<AccountButton />}>Favorites</ScreenTitle>
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
