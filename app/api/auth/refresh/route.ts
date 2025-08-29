import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { serialize } from "cookie";

const ACCESS_TOKEN_EXPIRES_IN = "15m";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return new NextResponse("Refresh token not found.", { status: 401 });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: number };
    } catch (error) {
      return new NextResponse("Invalid or expired refresh token.", { status: 401 });
    }

    // Check if the refresh token exists in the database
    const user = await prisma.sysUser.findFirst({
      where: {
        id: decoded.id,
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return new NextResponse("Refresh token is not in database!", { status: 401 });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Set the new access token in the cookie
    const accessTokenCookie = serialize("accessToken", newAccessToken, {
      path: "/",
      maxAge: 60 * 15, // 15 minutes
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });

    const headers = new Headers();
    headers.append("Set-Cookie", accessTokenCookie);

    return new NextResponse(JSON.stringify({ message: "Access token refreshed" }), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("REFRESH_TOKEN_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
