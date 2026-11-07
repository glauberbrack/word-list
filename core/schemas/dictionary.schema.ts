import { z } from 'zod';

const phoneticSchema = z.object({
  text: z.string().optional(),
  audio: z.string().optional(),
});

const definitionSchema = z.object({
  definition: z.string(),
  example: z.string().optional(),
});

const meaningSchema = z.object({
  partOfSpeech: z.string(),
  definitions: z.array(definitionSchema),
  synonyms: z.array(z.string()).default([]),
});

export const dictionaryEntrySchema = z.object({
  word: z.string(),
  phonetic: z.string().optional(),
  phonetics: z.array(phoneticSchema).default([]),
  meanings: z.array(meaningSchema).default([]),
});

export const dictionaryResponseSchema = z.array(dictionaryEntrySchema);

export type TDictionaryEntryDto = z.infer<typeof dictionaryEntrySchema>;
