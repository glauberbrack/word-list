import { useMemo } from 'react';

import { isFavoriteActive, listActiveFavorites } from '@/core/domain/favorites';
import { useFavoritesStore } from '@/store/favorites.store';

export function useFavoriteWords(): string[] {
  const items = useFavoritesStore((state) => state.items);

  return useMemo(() => listActiveFavorites(items).map((item) => item.word), [items]);
}

export function useIsFavorite(word: string): boolean {
  return useFavoritesStore((state) => isFavoriteActive(state.items[word]));
}

export function useToggleFavorite() {
  return useFavoritesStore((state) => state.toggle);
}
