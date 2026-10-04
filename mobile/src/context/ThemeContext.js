import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
  isDark: false,
  bg: '#f8fafc',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  headerBg: '#090d16',
  headerText: '#ffffff',
  statCardBg: '#f1f5f9',
};

export const darkTheme = {
  isDark: true,
  bg: '#090d16',
  card: '#0f172a',
  cardBorder: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  primary: '#818cf8',
  primaryDark: '#6366f1',
  inputBg: '#0f172a',
  inputBorder: '#334155',
  headerBg: '#090d16',
  headerText: '#ffffff',
  statCardBg: '#1e293b',
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); // Default to crazy dark theme!

  useEffect(() => {
    AsyncStorage.getItem('theme_mode').then((saved) => {
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme_mode', next ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
