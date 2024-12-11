'use client';

import { useAtom } from 'jotai';
import {
  userAtom,
  userPreferencesAtom,
  isAuthenticatedAtom,
  type UserState,
  type UserPreferences,
} from '../../stores/slices/user_store';

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const updateUser = (updates: Partial<UserState>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  return {
    user,
    updateUser,
    preferences,
    updatePreferences,
    isAuthenticated,
  };
};
