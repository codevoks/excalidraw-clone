import { NextResponse } from "next/server";
import { signAuthToken, verifyPassword } from "@repo/auth";
import { userService } from "@repo/db";
import { signInSchema } from "@repo/validation";
import { AUTH_COOKIE_NAME, getJwtSecret } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = signInSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;
    const user = await userService.findByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
    }

    const token = await signAuthToken(
      { userId: user.id, email: user.email },
      getJwtSecret()
    );
    const response = NextResponse.json({
      user: { id: user.id, email: user.email },
    });
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
    return NextResponse.json({ message: "Error while signing in." }, { status: 500 });
  }
}
