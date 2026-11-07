import { useState } from 'react';

import { listActiveFavorites } from '@/core/domain/favorites';
import { listHistory } from '@/core/domain/history';
import { useFavoritesStore } from '@/store/favorites.store';
import { useHistoryStore } from '@/store/history.store';

import { useAdjacentWords } from './use-adjacent-words';

type TWordNeighbors = {
  previous: TWordLink | null;
  next: TWordLink | null;
};

function snapshotWords(source: TWordSource): string[] {
  if (source === 'history') return listHistory(useHistoryStore.getState().items).map((i) => i.word);
  if (source === 'favorites') {
    return listActiveFavorites(useFavoritesStore.getState().items).map((item) => item.word);
  }

  return [];
}

function neighborsFromSnapshot(words: string[], word: string): TWordNeighbors {
  const index = words.indexOf(word);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? words.at(index - 1) : undefined;
  const next = words.at(index + 1);

  return {
    previous: previous ? { word: previous } : null,
    next: next ? { word: next } : null,
  };
}

export function useWordNeighbors(source: TWordSource, word: string, id: number | null) {
  const [snapshot] = useState(() => snapshotWords(source));
  const adjacent = useAdjacentWords(source === 'list' ? id : null);

  if (source !== 'list') return neighborsFromSnapshot(snapshot, word);

  return {
    previous: adjacent.data?.previous ?? null,
    next: adjacent.data?.next ?? null,
  };
}
