export const WORDS_PAGE_SIZE = 60;

export function getNextCursor(items: TWordEntry[], pageSize: number): number | null {
  if (items.length < pageSize) return null;

  return items.at(-1)?.id ?? null;
}
