import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './types/enum';
import { getDashboardPath } from './lib/utils';

const PUBLIC_ROUTES = ['/auth', '/'];
const AUTH_ROUTE = '/auth';

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  let userRole: UserRole | undefined;
  try {
    const userCookie = request.cookies.get('user')?.value;
    if (userCookie) {
      userRole = JSON.parse(userCookie).role as UserRole | undefined;
    }
  } catch (error) {
    // Invalid JSON in cookie, clear it
    console.error('Invalid user cookie:', error);
  }

  // Allow access to public routes
  if (
    PUBLIC_ROUTES.some(
      route => pathname === route || pathname.startsWith(route),
    )
  ) {
    // If authenticated and trying to access auth page, redirect to dashboard
    if (token && userRole && pathname.startsWith(AUTH_ROUTE)) {
      const destination = getDashboardPath(userRole);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}
