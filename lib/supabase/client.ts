import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SQLiteStorage } from 'expo-sqlite/kv-store';

import { isSupabaseConfigured, SUPABASE_KEY, SUPABASE_URL } from '@/constants/env';

const AUTH_STORAGE_DATABASE = 'supabase-auth.db';

export function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  const storage = new SQLiteStorage(AUTH_STORAGE_DATABASE);

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      storage: {
        getItem: (key) => storage.getItemAsync(key),
        setItem: (key, value) => storage.setItemAsync(key, value),
        removeItem: async (key) => {
          await storage.removeItemAsync(key);
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
