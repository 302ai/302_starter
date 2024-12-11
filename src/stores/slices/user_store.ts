'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('user-store');

export interface UserPreferences {
  emailNotifications: boolean;
  timezone: string;
  language: string;
}

export interface UserState {
  id?: string;
  email?: string;
  name?: string;
  preferences: UserPreferences;
  lastActive: string;
}

const defaultUserPreferences: UserPreferences = {
  emailNotifications: true,
  timezone: 'UTC',
  language: 'en',
};

const defaultUserState: UserState = {
  preferences: defaultUserPreferences,
  lastActive: new Date().toISOString(),
};

// Create atoms with logging
const createLoggingAtom = <T>(key: string, defaultValue: T) => {
  const atom = atomWithStorage<T>(key, defaultValue);
  return atom;
};

export const userAtom = createLoggingAtom<UserState>('user-state', defaultUserState);
export const userPreferencesAtom = createLoggingAtom<UserPreferences>(
  'user-preferences',
  defaultUserPreferences
);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  const isAuthenticated = !!user.id;
  logger.debug('Authentication state changed', { isAuthenticated, userId: user.id });
  return isAuthenticated;
});

// Log initial state
logger.info('User store initialized', { defaultUserState });
