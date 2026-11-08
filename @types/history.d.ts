declare type THistoryItem = {
  word: string;
  viewedAt: number;
};

declare type THistoryRepository = {
  getAll(): Record<string, THistoryItem>;
  save(item: THistoryItem): void;
  replaceAll(items: Record<string, THistoryItem>): void;
};
