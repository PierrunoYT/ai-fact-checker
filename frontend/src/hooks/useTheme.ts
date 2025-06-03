import { useState, useEffect, useCallback } from 'react';
import type { Theme, UseThemeReturn } from '../types';

/**
 * Custom hook for managing theme state and persistence
 */
export const useTheme = (): UseThemeReturn => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage and document class when theme changes
  useEffect(() => {
    const theme: Theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is saved in localStorage
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setIsDarkMode(theme === 'dark');
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  };
};
