import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api';

interface User {
  user_id: string;
  username: string;
  email: string;
  nombre: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        const response = await authApi.login(username, password);
        set({
          user: response.user,
          token: response.access_token,
          isAuthenticated: true,
        });
        // Guardar token en axios
        localStorage.setItem('token', response.access_token);
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
      },
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

