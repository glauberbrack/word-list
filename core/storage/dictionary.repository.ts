import { isCacheEntryFresh, toDictionaryLookup } from '../domain/dictionary';
import type { TDictionaryEntryDto } from '../schemas/dictionary.schema';

type TDictionaryRepositoryDeps = {
  cache: TDictionaryCache;
  fetchEntries: (word: string, signal?: AbortSignal) => Promise<TDictionaryEntryDto[] | null>;
  now?: () => number;
};

export function createDictionaryRepository({
  cache,
  fetchEntries,
  now = Date.now,
}: TDictionaryRepositoryDeps): TDictionaryRepository {
  return {
    async getWord(word, signal) {
      const cached = cache.get(word);
      if (cached && isCacheEntryFresh(cached, now())) return cached.lookup;

      const lookup = toDictionaryLookup(word, await fetchEntries(word, signal));
      cache.set(word, { lookup, fetchedAt: now() });

      return lookup;
    },
  };
}
