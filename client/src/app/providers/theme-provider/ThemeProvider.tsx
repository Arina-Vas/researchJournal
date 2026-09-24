import { useEffect, useState, type ReactNode } from 'react';
import { Theme } from './model/types';
import { ThemeContext } from './useTheme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: DARK)').matches ? 'DARK' : 'LIGHT';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
};
