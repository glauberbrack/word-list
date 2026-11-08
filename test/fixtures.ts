import type { TDictionaryEntryDto } from '@/core/schemas/dictionary.schema';

export const helloEntries: TDictionaryEntryDto[] = [
  {
    word: 'hello',
    phonetics: [
      { audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3' },
      {
        text: '/həˈləʊ/',
        audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
      },
      { text: '/həˈloʊ/', audio: '' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [{ definition: '"Hello!" or an equivalent greeting.' }],
        synonyms: ['greeting'],
      },
      {
        partOfSpeech: 'interjection',
        definitions: [{ definition: 'A greeting.', example: 'Hello, everyone.' }],
        synonyms: [],
      },
    ],
  },
  {
    word: 'hello',
    phonetic: '/hɛˈləʊ/',
    phonetics: [{ text: '/həˈləʊ/' }],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [{ definition: 'An expression of puzzlement.' }],
        synonyms: ['greeting', 'salutation'],
      },
    ],
  },
];

export function buildSyncOperation(overrides: Partial<TSyncOperation> = {}): TSyncOperation {
  return {
    id: 'favorite:hello:1000',
    entity: 'favorite',
    type: 'upsert',
    word: 'hello',
    at: 1000,
    attempts: 0,
    nextAttemptAt: 1000,
    ...overrides,
  };
}
