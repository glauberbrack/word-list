import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pickPronunciationAudio } from '@/core/domain/pronunciation';
import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { useRecordView } from '@/hooks/use-history';
import { usePrefetchWordDetail, useWordDetail } from '@/hooks/use-word-detail';
import { useWordNeighbors } from '@/hooks/use-word-neighbors';
import { colors, spacing } from '@/theme';

import { replaceWordDetail } from '../actions/open-word-detail';
import { DetailTopBar } from '../components/detail-top-bar';
import { FlashCard } from '../components/flash-card';
import { NeighborNavigation } from '../components/neighbor-navigation';
import { PronunciationPlayer } from '../components/pronunciation-player';
import { WordDetailBody } from '../components/word-detail-body';
import { toPositionLabel } from '../mappers/position-label';

type TWordDetailScreenProps = {
  word: string;
  id: number | null;
  source: TWordSource;
};

export function WordDetailScreen({ word, id, source }: TWordDetailScreenProps) {
  const detail = useWordDetail(word);
  const { previous, next, position } = useWordNeighbors(source, word, id);
  const prefetchWordDetail = usePrefetchWordDetail();
  const isFavorite = useIsFavorite(word);
  const toggleFavorite = useToggleFavorite();
  const recordView = useRecordView();

  const found = detail.data?.status === 'found' ? detail.data.detail : null;
  const audioUrl = found ? pickPronunciationAudio(found.phonetics) : null;

  useEffect(() => {
    recordView(word);
  }, [word, recordView]);

  useEffect(() => {
    if (next) void prefetchWordDetail(next.word);
  }, [next, prefetchWordDetail]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <DetailTopBar
        positionLabel={toPositionLabel(source, position)}
        isFavorite={isFavorite}
        onClose={() => router.back()}
        onToggleFavorite={() => toggleFavorite(word)}
      />
      <ScrollView key={word} contentContainerStyle={styles.content}>
        <FlashCard word={word} phonetic={found?.phonetic ?? null}>
          {detail.isPending ? null : (
            <PronunciationPlayer key={`${word}-${audioUrl}`} word={word} audioUrl={audioUrl} />
          )}
        </FlashCard>
        <WordDetailBody word={word} query={detail} />
      </ScrollView>
      <NeighborNavigation previous={previous} next={next} onNavigate={replaceWordDetail} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
