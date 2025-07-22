import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'evening' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme, isDark: theme === 'dark' }),
      isDark: false,
    }),
    {
      name: 'theme-storage',
    }
  )
);