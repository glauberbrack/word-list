import { isAxiosError } from 'axios';

import { dictionaryResponseSchema, type TDictionaryEntryDto } from '@/core/schemas';
import { dictionaryClient } from '@/services/server/client';

export async function fetchDictionaryEntries(
  word: string,
  signal?: AbortSignal,
): Promise<TDictionaryEntryDto[] | null> {
  try {
    const { data } = await dictionaryClient.get(`/entries/en/${encodeURIComponent(word)}`, {
      signal,
    });

    return dictionaryResponseSchema.parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}
