declare type TWordEntry = {
  id: number;
  word: string;
};

declare type TWordsPage = {
  items: TWordEntry[];
  nextCursor: number | null;
};

declare type TWordsPageParams = {
  cursor: number | null;
  limit: number;
};

declare type TWordDirection = 'previous' | 'next';

declare type TWordsRepository = {
  getPage(params: TWordsPageParams): Promise<TWordsPage>;
  getAdjacent(id: number, direction: TWordDirection): Promise<TWordEntry | null>;
  count(): Promise<number>;
};
