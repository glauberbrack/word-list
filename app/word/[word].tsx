import { useLocalSearchParams } from 'expo-router';

import { WordDetailScreen } from '@/features/word-detail/screens/word-detail-screen';

export default function WordRoute() {
  const { word } = useLocalSearchParams<{ word: string }>();

  return <WordDetailScreen word={word} />;
}
