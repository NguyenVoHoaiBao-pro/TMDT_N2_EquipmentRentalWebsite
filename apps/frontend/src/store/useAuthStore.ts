import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  username: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  loginSuccess: (user: AuthUser, token: string, refreshToken: string) => void;
  logoutSuccess: () => void;
}

// persist in middleware use for tracking the data in local storage
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      loginSuccess: (user, token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, isAuthenticated: true });
      },

      logoutSuccess: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
