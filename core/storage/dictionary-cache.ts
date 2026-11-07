import { readJson, writeJson } from './json-storage';

const cacheKey = (word: string) => `dict:${word}`;

export function createDictionaryCache(storage: TKeyValueStorage): TDictionaryCache {
  return {
    get: (word) => readJson<TDictionaryCacheEntry | null>(storage, cacheKey(word), null),
    set: (word, entry) => writeJson(storage, cacheKey(word), entry),
  };
}
