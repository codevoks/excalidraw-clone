import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "../../../../lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out." });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
