import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAdjacentWords } from '@/hooks/use-adjacent-words';
import { usePrefetchWordDetail, useWordDetail } from '@/hooks/use-word-detail';
import { colors, spacing, typography } from '@/theme';

import { WordCard } from '../components/word-card';
import { WordDetailBody } from '../components/word-detail-body';
import { WordNavigation } from '../components/word-navigation';

type TWordDetailScreenProps = {
  word: string;
  id: number | null;
};

function openWord(entry: TWordEntry) {
  router.setParams({ word: entry.word, id: String(entry.id) });
}

export function WordDetailScreen({ word, id }: TWordDetailScreenProps) {
  const detail = useWordDetail(word);
  const adjacent = useAdjacentWords(id);
  const prefetchWordDetail = usePrefetchWordDetail();

  const previous = adjacent.data?.previous ?? null;
  const next = adjacent.data?.next ?? null;
  const phonetic = detail.data?.status === 'found' ? detail.data.detail.phonetic : null;

  useEffect(() => {
    if (next) void prefetchWordDetail(next.word);
  }, [next, prefetchWordDetail]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={spacing.md}
          onPress={() => router.back()}
        >
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>
      <ScrollView key={word} contentContainerStyle={styles.content}>
        <WordCard word={word} phonetic={phonetic} />
        <WordDetailBody word={word} query={detail} />
      </ScrollView>
      <WordNavigation
        onPrevious={previous ? () => openWord(previous) : undefined}
        onNext={next ? () => openWord(next) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  close: {
    ...typography.heading,
    color: colors.text,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
