'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'jotai';

export * from './slices/config_store';
export * from './slices/language_store';
export * from './slices/user_store';

export type { ConfigState } from './slices/config_store';
export type { Language } from './slices/language_store';
export type { UserState, UserPreferences } from './slices/user_store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <Provider>{mounted ? children : null}</Provider>;
}
