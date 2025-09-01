import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요 없는 공개 경로 및 미들웨어 검사 제외 경로
  const publicPaths = ['/login', '/signup', '/landing', '/api/auth'];
  const bypassPaths = ['/_next/static', '/_next/image', '/favicon.ico'];

  if (bypassPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 공개 경로는 토큰 유무와 상관없이 접근 허용
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 그 외 모든 경로는 인증 필요
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    // API 요청인데 토큰이 없는 경우 401 응답
    if (pathname.startsWith('/api')) {
      return new NextResponse('Authentication required', { status: 401 });
    }
    // 페이지 요청인데 토큰이 없는 경우 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Access Token 검증 (login 시 사용된 ACCESS_TOKEN_SECRET 사용)
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    
    // 검증 성공 시 요청 계속 진행
    return NextResponse.next();

  } catch (error) {
    // API 요청에서 토큰이 유효하지 않은 경우 401 응답
    if (pathname.startsWith('/api')) {
      return new NextResponse('Invalid or expired token', { status: 401 });
    }
    
    // 페이지 요청에서 토큰이 유효하지 않은 경우 로그인 페이지로 리디렉션
    const response = NextResponse.redirect(new URL('/login', request.url));
    // 만료되거나 잘못된 토큰은 쿠키에서 삭제하여 반복적인 리디렉션을 방지
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This ensures the middleware runs on all pages and API routes.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};