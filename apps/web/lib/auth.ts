import { cookies } from "next/headers";
import { verifyAuthToken } from "@repo/auth";

export const AUTH_COOKIE_NAME = "auth_token";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return secret;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return verifyAuthToken(token, getJwtSecret());
}
