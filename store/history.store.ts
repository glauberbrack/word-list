import { create } from 'zustand';

import { recordView } from '@/core/domain/history';

type THistoryDeps = {
  repository: THistoryRepository;
  sync: Pick<TSyncEngine, 'enqueue'>;
  now?: () => number;
};

type THistoryState = {
  items: Record<string, THistoryItem>;
  deps: THistoryDeps | null;
  hydrate(deps: THistoryDeps): void;
  record(word: string): void;
};

export const useHistoryStore = create<THistoryState>()((set, get) => ({
  items: {},
  deps: null,
  hydrate(deps) {
    set({ deps, items: deps.repository.getAll() });
  },
  record(word) {
    const { deps, items } = get();
    if (!deps) return;

    const now = (deps.now ?? Date.now)();
    const item = recordView(word, now);

    set({ items: { ...items, [word]: item } });
    deps.repository.save(item);
    deps.sync.enqueue({ entity: 'history', type: 'upsert', word, at: now });
  },
}));
