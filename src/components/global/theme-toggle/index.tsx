'use client';

import React from 'react';
import { useIsDark } from '@/hooks/global/use-is-dark';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useIsDark();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};
