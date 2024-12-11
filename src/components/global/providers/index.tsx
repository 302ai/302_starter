'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { AppTheme } from '../app-theme';
import { StoreProvider } from '../../../stores';
import { ErrorBoundary } from '../error-boundary';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <SessionProvider session={session}>
          <AppTheme>{children}</AppTheme>
        </SessionProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}
