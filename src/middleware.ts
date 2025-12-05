// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_ROUTES = ['/admin', '/doctor', '/staff'];
const PATIENT_ROUTES = ['/patient'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userToken = request.cookies.get('access_token')?.value;
  const patientToken = request.cookies.get('patient_access_token')?.value;
  const userRole = request.cookies.get('role')?.value?.toUpperCase();

  // =================================================================
  // XỬ LÝ TRANG CHỦ /
  // =================================================================
  if (pathname === '/') {
    if (userToken && userRole) {
      const redirectMap: Record<string, string> = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        STAFF: '/staff',
      };
      const redirectUrl = redirectMap[userRole] || '/admin';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (patientToken) {
      return NextResponse.redirect(new URL('/patient', request.url));
    }

    // Chưa đăng nhập → về trang login nhân viên
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // =================================================================
  // 1. Nếu đã đăng nhập mà vào trang login → redirect phù hợp
  // =================================================================
  if (pathname === '/signin' || pathname === '/signin-patient') {
    if (userToken && userRole) {
      const redirectMap: Record<string, string> = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        STAFF: '/staff',
      };
      const redirectUrl = redirectMap[userRole];
      return NextResponse.redirect(new URL(redirectUrl ?? '/admin', request.url));
    }

    if (patientToken) {
      return NextResponse.redirect(new URL('/patient', request.url));
    }

    return NextResponse.next();
  }

  // =================================================================
  // 2. Bảo vệ route nhân viên
  // =================================================================
  const isUserRoute = USER_ROUTES.some(route => pathname.startsWith(route));
  if (isUserRoute) {
    if (!userToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    if (patientToken) {
      return NextResponse.redirect(new URL('/patient', request.url));
    }
    return NextResponse.next();
  }

  // =================================================================
  // 3. Bảo vệ route bệnh nhân
  // =================================================================
  const isPatientRoute = PATIENT_ROUTES.some(route => pathname.startsWith(route));
  if (isPatientRoute) {
    if (!patientToken) {
      return NextResponse.redirect(new URL('/signin-patient', request.url));
    }
    if (userToken) {
      return NextResponse.redirect(new URL('/', request.url)); // hoặc '/signin' tùy ý
    }
    return NextResponse.next();
  }

  // =================================================================
  // 4. Các route còn lại
  // =================================================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};