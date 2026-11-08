import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AccountButton } from '@/components/account/account-button';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenTitle } from '@/components/ui/screen-title';
import { WordGrid } from '@/components/word-grid/word-grid';
import { openWordDetail } from '@/features/word-detail/actions/open-word-detail';
import { useHistoryWords } from '@/hooks/use-history';
import { colors, spacing } from '@/theme';

export function HistoryScreen() {
  const words = useHistoryWords();
  const items = useMemo<TWordGridItem[]>(() => words.map((word) => ({ key: word, word })), [words]);
  const openWord = useCallback((item: TWordGridItem) => openWordDetail(item, 'history'), []);

  return (
    <View style={styles.container}>
      <ScreenTitle action={<AccountButton />}>History</ScreenTitle>
      {items.length === 0 ? (
        <EmptyState
          title="Nenhuma palavra vista ainda"
          description="As palavras que você abrir aparecem aqui, da mais recente para a mais antiga."
        />
      ) : (
        <WordGrid items={items} onPressItem={openWord} />
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
});
