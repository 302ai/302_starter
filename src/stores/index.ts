'use client';

import React from 'react';
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

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return React.createElement(Provider, {}, children);
};
