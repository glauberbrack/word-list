declare type TPhonetic = {
  text: string | null;
  audioUrl: string | null;
};

declare type TDefinition = {
  definition: string;
  example: string | null;
};

declare type TMeaning = {
  partOfSpeech: string;
  definitions: TDefinition[];
  synonyms: string[];
};

declare type TWordDetail = {
  word: string;
  phonetic: string | null;
  phonetics: TPhonetic[];
  meanings: TMeaning[];
};

declare type TDictionaryLookup = { status: 'found'; detail: TWordDetail } | { status: 'not_found' };
