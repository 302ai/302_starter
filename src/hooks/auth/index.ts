'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('auth-hook');

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      logger.info('User logged out successfully');
      router.push('/auth/signin');
    } catch (error) {
      logger.error('Error during logout', error);
    }
  };

  if (status === 'authenticated') {
    logger.debug('User session active', { user: session?.user });
  }

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    logout,
  };
};
