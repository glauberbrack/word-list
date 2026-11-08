import { helloEntries } from '@/test/fixtures';

import {
  FOUND_CACHE_TTL_MS,
  isCacheEntryFresh,
  NOT_FOUND_CACHE_TTL_MS,
  toDictionaryLookup,
  toWordDetail,
} from '../dictionary';

describe('toWordDetail', () => {
  it('junta os significados das entradas pela classe gramatical', () => {
    const detail = toWordDetail('hello', helloEntries);

    expect(detail.meanings.map((meaning) => meaning.partOfSpeech)).toEqual([
      'noun',
      'interjection',
    ]);
    expect(detail.meanings[0]?.definitions).toHaveLength(2);
    expect(detail.meanings[0]?.synonyms).toEqual(['greeting', 'salutation']);
  });

  it('usa o campo phonetic da entrada quando existe', () => {
    expect(toWordDetail('hello', helloEntries).phonetic).toBe('/hɛˈləʊ/');
  });

  it('cai para o primeiro texto de phonetics quando nenhuma entrada tem phonetic', () => {
    const [first] = helloEntries;

    expect(toWordDetail('hello', first ? [first] : []).phonetic).toBe('/həˈləʊ/');
  });

  it('descarta fonéticas vazias e repetidas e normaliza áudio vazio para null', () => {
    const { phonetics } = toWordDetail('hello', helloEntries);

    expect(phonetics).toEqual([
      {
        text: null,
        audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3',
      },
      {
        text: '/həˈləʊ/',
        audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3',
      },
      { text: '/həˈloʊ/', audioUrl: null },
      { text: '/həˈləʊ/', audioUrl: null },
    ]);
  });

  it('guarda o exemplo da definição ou null', () => {
    const interjection = toWordDetail('hello', helloEntries).meanings[1];

    expect(interjection?.definitions[0]?.example).toBe('Hello, everyone.');
  });
});

describe('toDictionaryLookup', () => {
  it('retorna not_found quando a API não tem entradas', () => {
    expect(toDictionaryLookup('aalii', null)).toEqual({ status: 'not_found' });
    expect(toDictionaryLookup('aalii', [])).toEqual({ status: 'not_found' });
  });

  it('retorna found com o detalhe montado', () => {
    const lookup = toDictionaryLookup('hello', helloEntries);

    expect(lookup.status).toBe('found');
  });
});

describe('isCacheEntryFresh', () => {
  const found: TDictionaryCacheEntry = {
    lookup: { status: 'found', detail: toWordDetail('hello', helloEntries) },
    fetchedAt: 0,
  };
  const notFound: TDictionaryCacheEntry = { lookup: { status: 'not_found' }, fetchedAt: 0 };

  it('mantém palavras encontradas por 30 dias', () => {
    expect(isCacheEntryFresh(found, FOUND_CACHE_TTL_MS - 1)).toBe(true);
    expect(isCacheEntryFresh(found, FOUND_CACHE_TTL_MS)).toBe(false);
  });

  it('mantém respostas 404 por 7 dias', () => {
    expect(isCacheEntryFresh(notFound, NOT_FOUND_CACHE_TTL_MS - 1)).toBe(true);
    expect(isCacheEntryFresh(notFound, NOT_FOUND_CACHE_TTL_MS)).toBe(false);
  });
});
