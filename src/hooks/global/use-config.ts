'use client';

import { useAtom } from 'jotai';
import {
  configAtom,
  isNavOpenAtom,
  notificationsAtom,
  preferencesAtom,
  type ConfigState,
} from '../../stores/slices/config_store';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('config-hook');

export const useConfig = () => {
  const [config, setConfig] = useAtom(configAtom);
  const [isNavOpen, setIsNavOpen] = useAtom(isNavOpenAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [preferences, setPreferences] = useAtom(preferencesAtom);

  const updateConfig = (updates: Partial<ConfigState>) => {
    logger.info('Updating config', { updates });
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateIsNavOpen = (value: boolean) => {
    logger.debug('Updating nav state', { value });
    setIsNavOpen(value);
  };

  const updateNotifications = (updates: Partial<ConfigState['notifications']>) => {
    logger.info('Updating notifications config', { updates });
    setNotifications((prev) => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: Partial<ConfigState['preferences']>) => {
    logger.info('Updating user preferences', { updates });
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig,
    isNavOpen,
    updateIsNavOpen,
    notifications,
    updateNotifications,
    preferences,
    updatePreferences,
  };
};
