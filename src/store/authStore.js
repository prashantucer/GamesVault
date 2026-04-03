import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,       // { name, email, avatar }
      isLoggedIn: false,

      login: (email, password) => {
        // Mock auth — in production this would call an API
        const stored = JSON.parse(localStorage.getItem('gv-users') || '[]');
        const found = stored.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid email or password.');
        const { password: _, ...safeUser } = found;
        set({ user: safeUser, isLoggedIn: true });
      },

      signup: (name, email, password) => {
        const stored = JSON.parse(localStorage.getItem('gv-users') || '[]');
        if (stored.find(u => u.email === email)) throw new Error('An account with this email already exists.');
        const newUser = { name, email, password, avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${email}` };
        localStorage.setItem('gv-users', JSON.stringify([...stored, newUser]));
        const { password: _, ...safeUser } = newUser;
        set({ user: safeUser, isLoggedIn: true });
      },

      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: 'gamevault-auth', partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn }) }
  )
);
