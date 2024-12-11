'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { languageAtom, availableLanguages, type Language } from '@/stores/slices/language_store';
import { createLanguagePath } from '@/i18n/utils';

export const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useAtom(languageAtom);
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    const newPath = createLanguagePath(pathname, newLanguage);
    router.push(newPath);
  };

  return (
    <select
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value as Language)}
      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-background text-foreground"
      aria-label="Select language"
    >
      {availableLanguages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
