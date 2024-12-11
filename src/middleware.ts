import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthPath } from '@/utils/path';
import { availableLanguages, defaultLanguage, Language } from '@/stores/slices/language_store';
import { getLanguageFromPath, createLanguagePath, normalizeLanguageCode } from '@/i18n/utils';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Handle language routing
  const language = getLanguageFromPath(path);
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLanguage = acceptLanguage
    ? normalizeLanguageCode(acceptLanguage.split(',')[0])
    : defaultLanguage;

  // Redirect to language-specific path if no language code is present
  if (!language) {
    const newPath = createLanguagePath(
      path,
      availableLanguages.includes(preferredLanguage as Language)
        ? preferredLanguage
        : defaultLanguage
    );
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Validate language code
  if (!availableLanguages.includes(language as Language)) {
    const newPath = createLanguagePath(path, defaultLanguage);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Handle authentication
  if (!isAuthPath(path) && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
