import type { User } from '@/domain/User';
import { create } from 'zustand';

type AuthUserStore = {
  user: User | null;
  setUser: (loginUser: User | null) => void;
  unsetUser: () => void;
};

export const useAuthUserStore = create<AuthUserStore>((set) => ({
  user: null,
  setUser: (loginUser) => set({ user: loginUser }),
  unsetUser: () => set({ user: null }),
}));
