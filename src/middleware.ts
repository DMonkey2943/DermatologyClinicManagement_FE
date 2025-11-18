// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route cần bảo vệ
const USER_ROUTES = ['/admin', '/doctor', '/staff'];
const PATIENT_ROUTES = ['/patient'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token
  const userToken = request.cookies.get('access_token')?.value;
  const patientToken = request.cookies.get('patient_access_token')?.value;
  const userRole = request.cookies.get('role')?.value?.toUpperCase();

  // =================================================================
  // 1. Nếu đã đăng nhập (bất kỳ loại nào) mà vào trang login → redirect phù hợp
  // =================================================================
  if (pathname === '/signin' || pathname === '/signin-patient') {
    if (userToken && userRole) {
      // Nhân viên đã đăng nhập
      const redirectMap: Record<string, string> = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        STAFF: '/staff',
      };
      const redirectUrl = redirectMap[userRole];
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (patientToken) {
      // Bệnh nhân đã đăng nhập
      return NextResponse.redirect(new URL('/patient', request.url));
    }

    // Chưa đăng nhập → cho vào trang login bình thường
    return NextResponse.next();
  }

  // =================================================================
  // 2. Bảo vệ route nhân viên (chỉ cho user token)
  // =================================================================
  const isUserRoute = USER_ROUTES.some(route => pathname.startsWith(route));
  if (isUserRoute) {
    if (!userToken) {
      // Chưa đăng nhập nhân viên → về trang login nhân viên
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    if (patientToken) {
      // Có token bệnh nhân nhưng vào route nhân viên → không cho phép
      return NextResponse.redirect(new URL('/patient', request.url));
    }

    // Có user token → kiểm tra quyền theo role (nếu cần)
    // (Tùy chọn: thêm kiểm tra role chi tiết hơn)
    return NextResponse.next();
  }

  // =================================================================
  // 3. Bảo vệ route bệnh nhân (chỉ cho patient token)
  // =================================================================
  const isPatientRoute = PATIENT_ROUTES.some(route => pathname.startsWith(route));
  if (isPatientRoute) {
    if (!patientToken) {
      // Chưa đăng nhập bệnh nhân → về trang login bệnh nhân
      return NextResponse.redirect(new URL('/signin-patient', request.url));
    }
    if (userToken) {
      // Có token nhân viên nhưng vào route bệnh nhân → không cho phép
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Có patient token → cho vào
    return NextResponse.next();
  }

  // =================================================================
  // 4. Các route khác (public, api, static...) → cho qua
  // =================================================================
  return NextResponse.next();
}

// Áp dụng middleware cho tất cả route trừ file tĩnh
export const config = {
  matcher: [
    /*
     * Match tất cả request trừ:
     * - api (api routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};