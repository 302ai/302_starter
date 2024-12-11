import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthPath } from '@/utils/path';
import { availableLanguages, defaultLanguage, Language } from '@/stores/slices/language_store';
import { getLanguageFromPath, createLanguagePath, normalizeLanguageCode } from '@/i18n/utils';

export async function middleware(request: NextRequest) {
  try {
    console.log('Middleware processing request:', request.url);

    // Skip middleware for API routes and static files
    if (
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/_next/')
    ) {
      console.log('Skipping middleware for API/static route');
      return NextResponse.next();
    }

    const token = await getToken({ req: request });
    console.log('Auth token status:', !!token);

    const isAuthenticated = !!token;
    const path = request.nextUrl.pathname;

    // Handle language routing
    const language = getLanguageFromPath(path);
    console.log('Language from path:', language);

    const acceptLanguage = request.headers.get('accept-language');
    const preferredLanguage = acceptLanguage
      ? normalizeLanguageCode(acceptLanguage.split(',')[0])
      : defaultLanguage;

    console.log('Preferred language:', preferredLanguage);

    // Skip language routing for auth pages
    if (isAuthPath(path)) {
      console.log('Skipping language routing for auth path');
      return NextResponse.next();
    }

    // Redirect to language-specific path if no language code is present
    if (!language) {
      const newPath = createLanguagePath(
        path,
        availableLanguages.includes(preferredLanguage as Language)
          ? preferredLanguage
          : defaultLanguage
      );
      console.log('Redirecting to language path:', newPath);
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    // Validate language code
    if (!availableLanguages.includes(language as Language)) {
      const newPath = createLanguagePath(path, defaultLanguage);
      console.log('Invalid language, redirecting to:', newPath);
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    // Handle authentication
    if (!isAuthPath(path) && !isAuthenticated) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', path);
      console.log('Redirecting to sign in:', signInUrl.toString());
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Continue without middleware on error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip api routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
