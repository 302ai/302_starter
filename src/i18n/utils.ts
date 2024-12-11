export const normalizeLanguageCode = (code: string): string => {
  // Convert language codes to lowercase and handle region subtags
  const [language] = code.toLowerCase().split('-');
  return language;
};

export const getLanguageFromPath = (pathname: string): string | null => {
  const segments = pathname.split('/');
  return segments[1] && segments[1].length === 2 ? segments[1] : null;
};

export const createLanguagePath = (pathname: string, language: string): string => {
  const segments = pathname.split('/');
  if (segments[1] && segments[1].length === 2) {
    segments[1] = language;
  } else {
    segments.splice(1, 0, language);
  }
  return segments.join('/');
};
