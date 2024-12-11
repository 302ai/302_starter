'use client';

import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { LanguageSwitcher } from '../language-switcher';

export function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Next.js Starter</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
