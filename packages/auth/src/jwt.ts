import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const JWT_ALG = "HS256";
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export type AuthPayload = {
  userId: number;
  email: string;
};

function getJwtSecret(secret: string): Uint8Array {
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
  }

  return encoder.encode(secret);
}

export async function signAuthToken(
  payload: AuthPayload,
  secret: string
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${ONE_WEEK_IN_SECONDS}s`)
    .sign(getJwtSecret(secret));
}

export async function verifyAuthToken(
  token: string,
  secret: string
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(secret));
    if (typeof payload.userId !== "number" || typeof payload.email !== "string") {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}
