import { useLocalSearchParams } from 'expo-router';

import { WordDetailScreen } from '@/features/word-detail/screens/word-detail-screen';

const SOURCES: TWordSource[] = ['list', 'history', 'favorites'];

function parseSource(value: string | undefined): TWordSource {
  return SOURCES.find((source) => source === value) ?? 'list';
}

export default function WordRoute() {
  const { word, id, source } = useLocalSearchParams<{
    word: string;
    id?: string;
    source?: string;
  }>();
  const parsedId = id ? Number(id) : null;

  return (
    <WordDetailScreen
      word={word}
      id={Number.isInteger(parsedId) ? parsedId : null}
      source={parseSource(source)}
    />
  );
}
