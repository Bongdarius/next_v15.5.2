export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "@/lib/auth"; // 방금 만든 함수를 임포트

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/signup", "/landing", "/api/auth"];
  const bypassPaths = ["/_next/static", "/_next/image", "/favicon.ico"];

  if (
    bypassPaths.some((path) => pathname.startsWith(path)) ||
    publicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken) {
    try {
      // Access Token이 유효한 경우, 통과
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      return NextResponse.next();
    } catch (error) {
      // Access Token이 만료되었거나 유효하지 않은 경우, 아래에서 리프레시 시도
      console.log("Access token invalid, attempting refresh...");
    }
  }

  // Access Token이 없거나 만료된 경우, Refresh Token으로 재발급 시도
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  const newAccessToken = await refreshAccessToken(refreshToken);

  if (!newAccessToken) {
    // 리프레시 실패 시, 로그인 페이지로 보내고 쿠키 삭제
    return redirectToLogin(request, true);
  }

  // 리프레시 성공 시, 새로운 Access Token을 쿠키에 담아 요청 계속 진행
  const response = NextResponse.next();
  response.cookies.set("accessToken", newAccessToken, {
    path: "/",
    maxAge: 60 * 15, // 15 minutes
    httpOnly: false, // 기존 설정 유지
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function redirectToLogin(request: NextRequest, clearCookies: boolean = false) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api")) {
    return new NextResponse("Authentication required", { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  if (clearCookies) {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
