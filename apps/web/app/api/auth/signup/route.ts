import { NextResponse } from "next/server";
import { hashPassword, signAuthToken } from "@repo/auth";
import { userService } from "@repo/db";
import { signUpSchema } from "@repo/validation";
import { AUTH_COOKIE_NAME, getJwtSecret } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = signUpSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;
    const existing = await userService.findByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "That email is already registered." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await userService.create(email, passwordHash);

    const token = await signAuthToken(
      { userId: user.id, email },
      getJwtSecret()
    );

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Error while creating account." }, { status: 500 });
  }
}
