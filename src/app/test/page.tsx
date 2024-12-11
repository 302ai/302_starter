'use client';

import React from 'react';
import { ThemeToggle } from '@/components/global/theme-toggle';
import { LanguageSwitcher } from '@/components/global/language-switcher';
import { StateDemo } from '@/components/demo/state-demo';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Theme Switching</h2>
            <ThemeToggle />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Language Switching</h2>
            <LanguageSwitcher />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">State Management</h2>
            <StateDemo />
          </section>
        </div>
      </div>
    </div>
  );
}
