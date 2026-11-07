import { create } from 'axios';

import { DICTIONARY_API_URL, REQUEST_TIMEOUT_MS } from '@/constants/api';

export const dictionaryClient = create({
  baseURL: DICTIONARY_API_URL,
  timeout: REQUEST_TIMEOUT_MS,
});
