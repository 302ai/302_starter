'use client';

import { atomWithStorage } from 'jotai/utils';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('config-store');

export interface ConfigState {
  isNavOpen: boolean;
  isMobile: boolean;
  isLoading: boolean;
  notifications: {
    showNotifications: boolean;
    sound: boolean;
    desktop: boolean;
  };
  preferences: {
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    contrastMode: 'normal' | 'high';
  };
}

const defaultConfig: ConfigState = {
  isNavOpen: true,
  isMobile: false,
  isLoading: false,
  notifications: {
    showNotifications: true,
    sound: true,
    desktop: false,
  },
  preferences: {
    fontSize: 'medium',
    reducedMotion: false,
    contrastMode: 'normal',
  },
};

// Create atoms with logging middleware
const createLoggingAtom = <T>(key: string, defaultValue: T) => {
  const atom = atomWithStorage<T>(key, defaultValue);
  return atom;
};

export const configAtom = createLoggingAtom('app-config', defaultConfig);
export const isNavOpenAtom = createLoggingAtom('nav-open', true);
export const notificationsAtom = createLoggingAtom('notifications', defaultConfig.notifications);
export const preferencesAtom = createLoggingAtom('preferences', defaultConfig.preferences);

// Log initial state
logger.info('Config store initialized', { defaultConfig });
