import { create } from 'zustand';

import { toggleFavorite } from '@/core/domain/favorites';

type TFavoritesDeps = {
  repository: TFavoritesRepository;
  sync: Pick<TSyncEngine, 'enqueue'>;
  now?: () => number;
};

type TFavoritesState = {
  items: Record<string, TFavorite>;
  deps: TFavoritesDeps | null;
  hydrate(deps: TFavoritesDeps): void;
  toggle(word: string): void;
  revert(word: string): void;
};

export const useFavoritesStore = create<TFavoritesState>()((set, get) => ({
  items: {},
  deps: null,
  hydrate(deps) {
    set({ deps, items: deps.repository.getAll() });
  },
  toggle(word) {
    const { deps, items } = get();
    if (!deps) return;

    const now = (deps.now ?? Date.now)();
    const next = toggleFavorite(items[word], word, now);

    set({ items: { ...items, [word]: next } });
    deps.repository.save(next);
    deps.sync.enqueue({
      entity: 'favorite',
      type: next.deleted ? 'delete' : 'upsert',
      word,
      at: now,
    });
  },
  revert(word) {
    const { deps, items } = get();
    const current = items[word];
    if (!deps || !current) return;

    const reverted = toggleFavorite(current, word, (deps.now ?? Date.now)());

    set({ items: { ...items, [word]: reverted } });
    deps.repository.save(reverted);
  },
}));
