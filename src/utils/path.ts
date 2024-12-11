const PUBLIC_PATHS = ['/auth/signin', '/auth/signup'];

export const isAuthPath = (path: string): boolean => {
  return PUBLIC_PATHS.includes(path);
};
