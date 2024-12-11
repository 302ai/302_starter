'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';

export const AppTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      themes={['light', 'dark']}
    >
      {children}
    </ThemeProvider>
  );
};
