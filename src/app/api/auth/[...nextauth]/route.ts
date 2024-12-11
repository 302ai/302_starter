import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { createScopedLogger } from '../../../../utils/logger';

const logger = createScopedLogger('auth-api');

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            logger.warn('Invalid credentials format', { error: parsedCredentials.error });
            return null;
          }

          // TODO: Replace with actual user authentication
          if (
            parsedCredentials.data.email === 'admin@example.com' &&
            parsedCredentials.data.password === 'password123'
          ) {
            logger.info('User authenticated successfully', { email: parsedCredentials.data.email });
            return {
              id: '1',
              email: parsedCredentials.data.email,
              name: 'Admin User',
            };
          }

          logger.warn('Authentication failed', { email: parsedCredentials.data.email });
          return null;
        } catch (error) {
          logger.error('Authentication error', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
