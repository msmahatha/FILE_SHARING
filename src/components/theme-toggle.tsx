import React from 'react';
import { Sun, Moon, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../lib/theme-store';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const themes = ['light', 'evening', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] as 'light' | 'evening' | 'dark';
    setTheme(nextTheme);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={cycleTheme}
      className="fixed top-4 right-20 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
    >
      {theme === 'dark' ? (
        <Moon className="w-6 h-6 text-yellow-200" />
      ) : theme === 'evening' ? (
        <Sunset className="w-6 h-6 text-orange-400" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-500" />
      )}
    </motion.button>
  );
}