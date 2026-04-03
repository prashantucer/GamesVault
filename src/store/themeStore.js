import { create } from 'zustand';

// Check if there's a saved theme in localStorage
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('color-theme', 'dark');
  }
  return 'dark'; // GameVault default is dark
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('color-theme', newTheme);

    // Update Document classes for Tailwind
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);

    return { theme: newTheme };
  }),
  setTheme: (theme) => set(() => {
    window.localStorage.setItem('color-theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    return { theme };
  })
}));
