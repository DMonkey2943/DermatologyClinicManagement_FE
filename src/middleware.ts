import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  // const refreshToken = request.cookies.get('refresh_token')?.value
  const pathname = request.nextUrl.pathname;

  // Nếu đang ở /signin mà đã login thì redirect về /
  if (pathname === '/signin' && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu chưa có token và không phải đang ở /signin thì redirect về /signin
  if (!accessToken && pathname !== '/signin') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
