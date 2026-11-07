declare type TDictionaryCacheEntry = {
  lookup: TDictionaryLookup;
  fetchedAt: number;
};

declare type TDictionaryCache = {
  get(word: string): TDictionaryCacheEntry | null;
  set(word: string, entry: TDictionaryCacheEntry): void;
};

declare type TDictionaryRepository = {
  getWord(word: string, signal?: AbortSignal): Promise<TDictionaryLookup>;
};

declare type TKeyValueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};
