import { create } from 'zustand';

import { toAuthErrorMessage } from '@/core/domain/auth';

type TAuthDeps = {
  gateway: TAuthGateway | null;
  beforeSignOut?: () => Promise<void>;
};

type TAuthState = {
  status: TAuthStatus;
  user: TAuthUser | null;
  error: string | null;
  pending: boolean;
  deps: TAuthDeps | null;
  configure(deps: TAuthDeps): void;
  setUser(user: TAuthUser | null): void;
  signIn(email: string, password: string): Promise<boolean>;
  signUp(email: string, password: string): Promise<TSignUpResult | null>;
  signOut(): Promise<void>;
  clearError(): void;
};

function errorMessage(error: unknown): string {
  return toAuthErrorMessage(error instanceof Error ? error.message : '');
}

export const useAuthStore = create<TAuthState>()((set, get) => {
  async function run<T>(action: (gateway: TAuthGateway) => Promise<T>): Promise<T | null> {
    const gateway = get().deps?.gateway;
    if (!gateway) return null;

    set({ pending: true, error: null });
    try {
      return await action(gateway);
    } catch (error) {
      set({ error: errorMessage(error) });
      return null;
    } finally {
      set({ pending: false });
    }
  }

  return {
    status: 'loading',
    user: null,
    error: null,
    pending: false,
    deps: null,
    configure(deps) {
      set({ deps, status: deps.gateway ? 'loading' : 'unavailable' });
    },
    setUser(user) {
      set({ user, status: user ? 'signed-in' : 'signed-out' });
    },
    async signIn(email, password) {
      const result = await run(async (gateway) => {
        await gateway.signIn(email, password);
        return true;
      });
      return result ?? false;
    },
    signUp(email, password) {
      return run((gateway) => gateway.signUp(email, password));
    },
    async signOut() {
      await get().deps?.beforeSignOut?.();
      await run((gateway) => gateway.signOut());
    },
    clearError() {
      set({ error: null });
    },
  };
});
