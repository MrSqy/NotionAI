import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('accessToken'),
  setAuth: (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));
