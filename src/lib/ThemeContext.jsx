import { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './themeContextInstance';
import { ACCENTS, DEFAULT_ACCENT, THEME_STORAGE_KEY } from './themeConstants';

export function ThemeProvider({ children }) {
  const [accent, setAccentState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ACCENT;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const found = ACCENTS.find((a) => a.id === saved || a.value === saved);
        if (found) return found;
      }
    } catch {
      // localStorage may fail in privacy / restricted mode
    }
    return DEFAULT_ACCENT;
  });

  const setAccent = useCallback((newAccent) => {
    const selected =
      typeof newAccent === 'string'
        ? ACCENTS.find((a) => a.id === newAccent || a.value === newAccent) || DEFAULT_ACCENT
        : newAccent;

    setAccentState(selected);
    try {
      document.documentElement.style.setProperty('--accent', selected.value);
      localStorage.setItem(THEME_STORAGE_KEY, selected.id);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--accent', accent.value);
    } catch {
      // ignore
    }
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent, accents: ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  );
}
