import { useMemo } from 'react';

import { isFavoriteActive, listActiveFavorites } from '@/core/domain/favorites';
import { useFavoritesStore } from '@/store/favorites.store';

export function useActiveFavorites(): TFavorite[] {
  const items = useFavoritesStore((state) => state.items);

  return useMemo(() => listActiveFavorites(items), [items]);
}

export function useFavoriteWords(): string[] {
  const favorites = useActiveFavorites();

  return useMemo(() => favorites.map((item) => item.word), [favorites]);
}

export function useIsFavorite(word: string): boolean {
  return useFavoritesStore((state) => isFavoriteActive(state.items[word]));
}

export function useToggleFavorite() {
  return useFavoritesStore((state) => state.toggle);
}
