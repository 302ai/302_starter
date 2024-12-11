'use client';

import { atomWithStorage } from 'jotai/utils';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('language-store');

export type Language = 'en' | 'es' | 'zh';

export const defaultLanguage: Language = 'en';

export const availableLanguages: Language[] = ['en', 'es', 'zh'];

// Create atom with logging
export const languageAtom = atomWithStorage<Language>('language', defaultLanguage);

// Log initial state
logger.info('Language store initialized', { defaultLanguage, availableLanguages });
