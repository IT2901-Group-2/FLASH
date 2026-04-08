import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ADMIN_PASSWORD,
} from "@/config/admin";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "@/config";

// Types
// Shape of the JWT payload - currently just marks the bearer as admin
export type TokenPayload = {
  admin: true;
};

const ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD, 10);

/** Password verfication
 * Compares the provided password against a bcrypt hash derived from ADMIN_PASSWORD.
 * The hash is generated once at module load time to avoid rehashing on every request
 */
export async function verifyLogin(password: string): Promise<boolean> {
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

/** Token signing
 * Signs a new access token and writes it as an httpOnly cookie on the response.
 * Returns the expiry in milliseconds
 */
export async function signAccessToken(): Promise<{ expiresIn: number }> {
  const cookieStore = await cookies();
  const accessToken = jwt.sign({ admin: true }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ACCESS_TOKEN_EXPIRY,
  });
  return {
    expiresIn: ACCESS_TOKEN_EXPIRY * 1000,
  };
}

/**
 * Signs a new refresh token and writes it as an httpOnly cookie on the response.
 */
export async function signRefreshToken(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = jwt.sign({ admin: true }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
}

/** Token verification
 * Type guard - confirms that a decoded JWT payload matches the expected shape.
 * Guards against tokens that are valid JWTs but carry an unexpected payload.
 */
function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "admin" in value &&
    value.admin === true
  );
}

/**
 * Extracts and verifies the access token from the incoming request's cookies.
 * Throws error if the token is missing, expired, or has an invalid payload.
 */
export async function verifyAccessToken(): Promise<TokenPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("Missing access token");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!isTokenPayload(decoded)) throw new Error("Invalid token payload");
    return decoded;
  } catch {
    await clearAccessToken();
    throw new Error("Invalid or expired access token");
  }
}

/**
 * Extracts and verifies the refresh token from the incoming request's cookies.
 * Throws error if the token is missing, expired, or has an invalid payload.
 */
export async function verifyRefreshToken(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    if (!isTokenPayload(decoded)) {
      throw new Error("Invalid token payload");
    }
    return decoded;
  } catch {
    await clearAccessToken();
    await clearRefreshToken();
    throw new Error("Invalid or expired refresh token");
  }
}

/** Logout
 *  Clears the refresh token cookie by overwritting it with an empty, immediatly-expiring value.
 *  Mirrors the original cookie config to ensure the browser removes it.
 */
export async function clearRefreshToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
}

/**
 * Clears the access token cookie.
 */
export async function clearAccessToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
}
