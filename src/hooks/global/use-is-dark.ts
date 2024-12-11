'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useIsDark = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsDark(
      theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [theme]);

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return { isDark, toggleTheme };
};
