import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serialize } from 'cookie';
import { refreshAccessToken } from '@/lib/auth'; // 공통 함수 임포트

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return new NextResponse('Refresh token not found.', { status: 401 });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      return new NextResponse('Invalid or expired refresh token.', { status: 401 });
    }

    // 새로운 Access Token을 쿠키에 설정
    const accessTokenCookie = serialize('accessToken', newAccessToken, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);

    return new NextResponse(JSON.stringify({ message: 'Access token refreshed' }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('REFRESH_TOKEN_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
