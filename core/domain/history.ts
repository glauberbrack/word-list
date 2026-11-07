export function recordView(word: string, now: number): THistoryItem {
  return { word, viewedAt: now };
}

export function listHistory(items: Record<string, THistoryItem>): THistoryItem[] {
  return Object.values(items).sort((a, b) => b.viewedAt - a.viewedAt);
}
