import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken } from "@repo/auth/jwt";

const AUTH_COOKIE_NAME = "auth_token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const payload = await verifyAuthToken(token, secret);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
