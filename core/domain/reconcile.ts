function mergeBy<T extends { word: string }>(
  sources: Record<string, T>[],
  isNewer: (candidate: T, current: T) => boolean,
): Record<string, T> {
  const merged: Record<string, T> = {};

  for (const source of sources) {
    for (const item of Object.values(source)) {
      const current = merged[item.word];
      if (!current || isNewer(item, current)) merged[item.word] = item;
    }
  }

  return merged;
}

export function mergeFavorites(...sources: Record<string, TFavorite>[]) {
  return mergeBy(sources, (candidate, current) => candidate.updatedAt > current.updatedAt);
}

export function mergeHistory(...sources: Record<string, THistoryItem>[]) {
  return mergeBy(sources, (candidate, current) => candidate.viewedAt > current.viewedAt);
}

export function favoritesToUpload(
  merged: Record<string, TFavorite>,
  remote: Record<string, TFavorite>,
): TSyncOperationInput[] {
  return Object.values(merged)
    .filter((item) => (remote[item.word]?.updatedAt ?? -1) < item.updatedAt)
    .map((item) => ({
      entity: 'favorite',
      type: item.deleted ? 'delete' : 'upsert',
      word: item.word,
      at: item.updatedAt,
    }));
}

export function historyToUpload(
  merged: Record<string, THistoryItem>,
  remote: Record<string, THistoryItem>,
): TSyncOperationInput[] {
  return Object.values(merged)
    .filter((item) => (remote[item.word]?.viewedAt ?? -1) < item.viewedAt)
    .map((item) => ({ entity: 'history', type: 'upsert', word: item.word, at: item.viewedAt }));
}
