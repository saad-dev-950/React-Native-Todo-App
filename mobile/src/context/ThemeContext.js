import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const NEON_ACCENTS = {
  purple: { key: 'purple', name: 'Electric Violet 💜', primary: '#6366f1', primaryGlow: '#818cf8', bgGradient: '#1e1b4b' },
  cyan: { key: 'cyan', name: 'Neon Cyan 🩵', primary: '#06b6d4', primaryGlow: '#22d3ee', bgGradient: '#083344' },
  pink: { key: 'pink', name: 'Electric Pink 🩷', primary: '#ec4899', primaryGlow: '#f472b6', bgGradient: '#4c0519' },
  yellow: { key: 'yellow', name: 'Cyber Yellow 💛', primary: '#eab308', primaryGlow: '#facc15', bgGradient: '#451a03' },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [accentKey, setAccentKey] = useState('purple');

  useEffect(() => {
    AsyncStorage.getItem('theme_mode').then((saved) => {
      if (saved !== null) setIsDark(saved === 'dark');
    });
    AsyncStorage.getItem('accent_theme').then((savedAccent) => {
      if (savedAccent && NEON_ACCENTS[savedAccent]) setAccentKey(savedAccent);
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme_mode', next ? 'dark' : 'light');
  };

  const changeAccent = async (key) => {
    if (NEON_ACCENTS[key]) {
      setAccentKey(key);
      await AsyncStorage.setItem('accent_theme', key);
    }
  };

  const activeAccent = NEON_ACCENTS[accentKey] || NEON_ACCENTS.purple;

  const lightTheme = {
    isDark: false,
    bg: '#f8fafc',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    primary: activeAccent.primary,
    primaryGlow: activeAccent.primaryGlow,
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    headerBg: '#090d16',
    headerText: '#ffffff',
    statCardBg: '#f1f5f9',
    accentKey: activeAccent.key,
  };

  const darkTheme = {
    isDark: true,
    bg: '#090d16',
    card: '#0f172a',
    cardBorder: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    primary: activeAccent.primaryGlow,
    primaryGlow: activeAccent.primary,
    inputBg: '#0f172a',
    inputBorder: '#334155',
    headerBg: '#090d16',
    headerText: '#ffffff',
    statCardBg: '#1e293b',
    accentKey: activeAccent.key,
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        theme,
        activeAccent,
        changeAccent,
        accentsList: Object.values(NEON_ACCENTS),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
