// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  username: string;
  roles: string[];
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  loginSuccess: (user: AuthUser, token: string) => void;
  logoutSuccess: () => void;
}

// Persist middleware auto stores user and isAuthenticated status with the name 'auth-storage' in localStorage
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      loginSuccess: (user, token) => {
        localStorage.setItem('token', token);

        set({ user, isAuthenticated: true });
      },

      logoutSuccess: () => {
        localStorage.removeItem('token');

        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Remain for zustand store user and isAuthenticated status
    },
  ),
);
