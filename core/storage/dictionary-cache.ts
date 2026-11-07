const cacheKey = (word: string) => `dict:${word}`;

export function createDictionaryCache(storage: TKeyValueStorage): TDictionaryCache {
  return {
    get(word) {
      const raw = storage.getItem(cacheKey(word));
      if (!raw) return null;

      try {
        return JSON.parse(raw) as TDictionaryCacheEntry;
      } catch {
        storage.removeItem(cacheKey(word));
        return null;
      }
    },
    set(word, entry) {
      storage.setItem(cacheKey(word), JSON.stringify(entry));
    },
  };
}
