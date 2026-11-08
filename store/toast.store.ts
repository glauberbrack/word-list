import { create } from 'zustand';

type TToastState = {
  message: string | null;
  show(message: string): void;
  hide(): void;
};

export const useToastStore = create<TToastState>()((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
