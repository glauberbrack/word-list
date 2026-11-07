import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { useRecordView } from '@/hooks/use-history';
import { usePrefetchWordDetail, useWordDetail } from '@/hooks/use-word-detail';
import { useWordNeighbors } from '@/hooks/use-word-neighbors';
import { colors, spacing, typography } from '@/theme';

import { replaceWordDetail } from '../actions/open-word-detail';
import { FavoriteButton } from '../components/favorite-button';
import { WordCard } from '../components/word-card';
import { WordDetailBody } from '../components/word-detail-body';
import { WordNavigation } from '../components/word-navigation';

type TWordDetailScreenProps = {
  word: string;
  id: number | null;
  source: TWordSource;
};

export function WordDetailScreen({ word, id, source }: TWordDetailScreenProps) {
  const detail = useWordDetail(word);
  const { previous, next } = useWordNeighbors(source, word, id);
  const prefetchWordDetail = usePrefetchWordDetail();
  const isFavorite = useIsFavorite(word);
  const toggleFavorite = useToggleFavorite();
  const recordView = useRecordView();

  const phonetic = detail.data?.status === 'found' ? detail.data.detail.phonetic : null;

  useEffect(() => {
    recordView(word);
  }, [word, recordView]);

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
        <WordCard
          word={word}
          phonetic={phonetic}
          action={<FavoriteButton active={isFavorite} onPress={() => toggleFavorite(word)} />}
        />
        <WordDetailBody word={word} query={detail} />
      </ScrollView>
      <WordNavigation
        onPrevious={previous ? () => replaceWordDetail(previous) : undefined}
        onNext={next ? () => replaceWordDetail(next) : undefined}
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
