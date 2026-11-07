export function toggleFavorite(
  current: TFavorite | undefined,
  word: string,
  now: number,
): TFavorite {
  if (!current || current.deleted) {
    return { word, createdAt: now, updatedAt: now, deleted: false };
  }

  return { ...current, updatedAt: now, deleted: true };
}

export function isFavoriteActive(item: TFavorite | undefined): boolean {
  return item !== undefined && !item.deleted;
}

export function listActiveFavorites(items: Record<string, TFavorite>): TFavorite[] {
  return Object.values(items)
    .filter((item) => !item.deleted)
    .sort((a, b) => b.createdAt - a.createdAt);
}
