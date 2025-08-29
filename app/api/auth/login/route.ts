import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new NextResponse("Username and password are required", {
        status: 400,
      });
    }

    const user = await prisma.sysUser.findUnique({
      where: { username },
    });

    if (!user) {
      return new NextResponse("Invalid username or password", { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse("Invalid username or password", { status: 401 });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token in the database
    await prisma.sysUser.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    // Serialize cookies
    const accessTokenCookie = serialize("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 15, // 15 minutes
      httpOnly: false, // Accessible by client-side script
      secure: process.env.NODE_ENV === "production",
    });

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true, // Not accessible by client-side script
      secure: process.env.NODE_ENV === "production",
    });

    const headers = new Headers();
    headers.append("Set-Cookie", accessTokenCookie);
    headers.append("Set-Cookie", refreshTokenCookie);

    return new NextResponse("Login successful", {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
