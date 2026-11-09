import { useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AccountButton } from '@/components/account/account-button';
import { useFavoriteWords } from '@/hooks/use-favorites';
import { useHistoryWords } from '@/hooks/use-history';
import { useWordCount } from '@/hooks/use-word-count';
import { colors, spacing, typography } from '@/theme';
import { formatQuantity } from '@/utils/format/count';

function useActiveTabSubtitle(): string {
  const segments = useSegments();
  const activeTab = segments.at(-1);
  const wordCount = useWordCount();
  const favorites = useFavoriteWords();
  const history = useHistoryWords();

  if (activeTab === 'favorites') return formatQuantity(favorites.length, 'favorita', 'favoritas');
  if (activeTab === 'history') return formatQuantity(history.length, 'vista', 'vistas');
  if (wordCount.data === undefined) return ' ';

  return formatQuantity(wordCount.data, 'palavra', 'palavras');
}

export function AppHeader() {
  const subtitle = useActiveTabSubtitle();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title} accessibilityRole="header">
          Dicionário
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <AccountButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
