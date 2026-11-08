declare type TAuthUser = {
  id: string;
  email: string | null;
};

declare type TAuthStatus = 'unavailable' | 'loading' | 'signed-out' | 'signed-in';

declare type TSignUpResult = {
  needsConfirmation: boolean;
};

declare type TAuthGateway = {
  getCurrentUser(): Promise<TAuthUser | null>;
  onAuthChange(listener: (user: TAuthUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<TSignUpResult>;
  signOut(): Promise<void>;
};

declare type TRemoteUserData = {
  fetchFavorites(userId: string): Promise<Record<string, TFavorite>>;
  fetchHistory(userId: string): Promise<Record<string, THistoryItem>>;
};
