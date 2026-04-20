import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth-server';

const SESSION_COOKIE = 'sk_crown_admin_session';

// Define protected and public routes
const publicRoutes = ['/login', '/'];
const protectedRoutes = ['/dashboard', '/crm', '/invoices', '/pnl', '/quotations'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // 1. Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }

  // 2. Redirect to /dashboard if the user is authenticated and trying to access the login page
  if (isPublicRoute && session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
