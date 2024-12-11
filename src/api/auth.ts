import { signIn, signOut } from 'next-auth/react';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const result = await signIn('credentials', {
      ...credentials,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  },

  logout: async () => {
    await signOut({ redirect: false });
  },
};
