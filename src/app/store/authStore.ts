import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  balance: number;
  avatar?: string;
  favorites: string[];
}

interface AuthStore {
  user: User | null;
  login: (name: string, initialBalance: number) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addToFavorites: (cryptoId: string) => void;
  removeFromFavorites: (cryptoId: string) => void;
  deposit: (amount: number) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (name, initialBalance) =>
        set({ user: { name, balance: initialBalance, favorites: [] } }),
      logout: () => set({ user: null }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      addToFavorites: (cryptoId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                favorites: [...state.user.favorites, cryptoId],
              }
            : null,
        })),
      removeFromFavorites: (cryptoId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                favorites: state.user.favorites.filter((id) => id !== cryptoId),
              }
            : null,
        })),
      deposit: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, balance: state.user.balance + amount }
            : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
