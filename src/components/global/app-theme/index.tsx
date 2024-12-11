'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';

export const AppTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      themes={['light', 'dark']}
    >
      {mounted ? children : null}
    </ThemeProvider>
  );
};
