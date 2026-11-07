import type { TDictionaryEntryDto } from '../schemas/dictionary.schema';

const DAY_MS = 24 * 60 * 60 * 1000;

export const FOUND_CACHE_TTL_MS = 30 * DAY_MS;
export const NOT_FOUND_CACHE_TTL_MS = 7 * DAY_MS;

export function isCacheEntryFresh(entry: TDictionaryCacheEntry, now: number): boolean {
  const ttl = entry.lookup.status === 'found' ? FOUND_CACHE_TTL_MS : NOT_FOUND_CACHE_TTL_MS;

  return now - entry.fetchedAt < ttl;
}

function nonEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function toPhonetics(entries: TDictionaryEntryDto[]): TPhonetic[] {
  const seen = new Set<string>();

  return entries
    .flatMap((entry) => entry.phonetics)
    .map((phonetic) => ({ text: nonEmpty(phonetic.text), audioUrl: nonEmpty(phonetic.audio) }))
    .filter((phonetic) => {
      const key = `${phonetic.text}|${phonetic.audioUrl}`;
      if ((!phonetic.text && !phonetic.audioUrl) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function toMeanings(entries: TDictionaryEntryDto[]): TMeaning[] {
  const byPartOfSpeech = new Map<string, TMeaning>();

  for (const meaning of entries.flatMap((entry) => entry.meanings)) {
    const current = byPartOfSpeech.get(meaning.partOfSpeech) ?? {
      partOfSpeech: meaning.partOfSpeech,
      definitions: [],
      synonyms: [],
    };

    current.definitions.push(
      ...meaning.definitions.map((item) => ({
        definition: item.definition,
        example: nonEmpty(item.example),
      })),
    );
    current.synonyms = [...new Set([...current.synonyms, ...meaning.synonyms])];
    byPartOfSpeech.set(meaning.partOfSpeech, current);
  }

  return [...byPartOfSpeech.values()];
}

export function toWordDetail(word: string, entries: TDictionaryEntryDto[]): TWordDetail {
  const phonetics = toPhonetics(entries);
  const phonetic =
    entries.map((entry) => nonEmpty(entry.phonetic)).find(Boolean) ??
    phonetics.find((item) => item.text)?.text ??
    null;

  return { word, phonetic, phonetics, meanings: toMeanings(entries) };
}

export function toDictionaryLookup(
  word: string,
  entries: TDictionaryEntryDto[] | null,
): TDictionaryLookup {
  if (!entries?.length) return { status: 'not_found' };

  return { status: 'found', detail: toWordDetail(word, entries) };
}
