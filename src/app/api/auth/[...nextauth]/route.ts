import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(4) }) // Changed min length to 4
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        // Demo credentials for testing
        if (
          parsedCredentials.data.email === 'admin@example.com' &&
          parsedCredentials.data.password === 'admin'
        ) {
          return {
            id: '1',
            email: parsedCredentials.data.email,
            name: 'Admin User',
          };
        }

        return null;
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
