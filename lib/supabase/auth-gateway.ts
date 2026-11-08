import type { SupabaseClient, User } from '@supabase/supabase-js';
import { AppState } from 'react-native';

function toAuthUser(user: User | null | undefined): TAuthUser | null {
  return user ? { id: user.id, email: user.email ?? null } : null;
}

export function createSupabaseAuthGateway(client: SupabaseClient): TAuthGateway {
  return {
    async getCurrentUser() {
      const { data } = await client.auth.getSession();
      return toAuthUser(data.session?.user);
    },
    onAuthChange(listener) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        listener(toAuthUser(session?.user));
      });
      const appState = AppState.addEventListener('change', (state) => {
        if (state === 'active') void client.auth.startAutoRefresh();
        else void client.auth.stopAutoRefresh();
      });

      return () => {
        data.subscription.unsubscribe();
        appState.remove();
      };
    },
    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    },
    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
      return { needsConfirmation: data.session === null };
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw new Error(error.message);
    },
  };
}
