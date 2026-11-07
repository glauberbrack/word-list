import { useLocalSearchParams } from 'expo-router';

import { WordDetailScreen } from '@/features/word-detail/screens/word-detail-screen';

export default function WordRoute() {
  const { word, id } = useLocalSearchParams<{ word: string; id?: string }>();
  const parsedId = id ? Number(id) : null;

  return <WordDetailScreen word={word} id={Number.isInteger(parsedId) ? parsedId : null} />;
}
