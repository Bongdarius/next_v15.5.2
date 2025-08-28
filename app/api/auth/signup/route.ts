import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !password) {
      return new NextResponse("Username and password are required", { status: 400 });
    }

    // Check if user already exists
    const existingUserByUsername = await prisma.sysUser.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return new NextResponse("Username already exists", { status: 409 });
    }

    if (email) {
        const existingUserByEmail = await prisma.sysUser.findUnique({
            where: { email: email },
        });

        if (existingUserByEmail) {
            return new NextResponse("Email already exists", { status: 409 });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.sysUser.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
