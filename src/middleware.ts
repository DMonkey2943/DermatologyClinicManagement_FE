import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ Cấu hình route & role được phép
const rolePermissions: Record<string, string[]> = {
  '/users': ['ADMIN'],
  '/patients/': ['ADMIN', 'STAFF'], // /patients/[id]
  '/patients': ['ADMIN', 'DOCTOR', 'STAFF'],
  '/appointments/': ['ADMIN', 'STAFF'],
  '/medical-records/add': ['ADMIN', 'DOCTOR'],
  '/medical-records': ['ADMIN', 'DOCTOR'],
  '/invoices/preview': ['ADMIN', 'STAFF'],
  '/invoices': ['ADMIN', 'DOCTOR', 'STAFF'],
  '/medications': ['ADMIN'],
  '/services': ['ADMIN'],
};

// ✅ Hàm kiểm tra quyền
function isAuthorized(pathname: string, userRole: string | undefined): boolean {
  for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole || '');
    }
  }
  return true; // Route không có trong config => không cần kiểm tra quyền
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('role')?.value; // cookie 'role' do backend set
  const pathname = request.nextUrl.pathname;

  // Nếu đã login mà vẫn vào /signin => redirect về trang chủ
  if (pathname === '/signin' && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu chưa đăng nhập và không phải /signin => chuyển đến /signin
  if (!accessToken && pathname !== '/signin') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Nếu có token, kiểm tra quyền
  if (accessToken && !isAuthorized(pathname, userRole)) {
    return NextResponse.redirect(new URL('/error-404', request.url));
  }

  // Cho phép đi tiếp
  return NextResponse.next();
}

// ✅ Chỉ áp dụng middleware cho các route người dùng
export const config = {
  matcher: [
    /*
     * Match tất cả các request trừ:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};