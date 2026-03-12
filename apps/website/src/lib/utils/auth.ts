import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ADMIN_PASSWORD,
} from "@/config/admin";

// Types
// Shape of the JWT payload - currently just marks the bearer as admin
export type TokenPayload = {
  admin: true;
};

/** Password verfication
 * Validates the provided paassword against the stored ADMIN_PASWORD env variable.
 */
export async function verifyLogin(password: string): Promise<boolean> {
  return password == ADMIN_PASSWORD;
  // return bcrypt.compare(password, ADMIN_PASSWORD);
}

/** Token signing
 * Signs a new access token and writes it as an httpOnly cookie on the response.
 * Returns the expiry in milliseconds
 */
export function signAccessToken(res: NextResponse): {
  expiresIn: number;
} {
  const accessToken = jwt.sign({ admin: true }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  res.cookies.set("accessToken", accessToken, {
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
 * Scoped to /api/auth/refresh so it isn't sent on every request.
 */
export function signRefreshToken(res: NextResponse): void {
  const refreshToken = jwt.sign({ admin: true }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY,
    path: "/api/auth/refresh",
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
export function verifyAccessToken(req: NextRequest, res: NextResponse): TokenPayload {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) throw new Error("Missing access token");
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (!isTokenPayload(decoded)) throw new Error("Invalid token payload");
    return decoded;
  } catch {
    clearAccessToken(res);
    throw new Error("Invalid or expired access token");
  }
}

/**
 * Extracts and verifies the refresh token from the incoming request's cookies.
 * Throws error if the token is missing, expired, or has an invalid payload.
 * Called by the /api/auth/refresh endpoint to issue a new access token.
 */
export function verifyRefreshToken(
  req: NextRequest,
  res: NextResponse
): TokenPayload | null {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (!isTokenPayload(decoded)) {
      throw new Error("Invalid token payload");
    }
    return decoded;
  } catch {
    clearAccessToken(res);
    throw new Error("Invalid or expired refresh token");
  }
}

/** Logout
 *  Clears the refresh token cookie by overwritting it with an empty, immediatly-expiring value.
 *  Mirrors the original cookie config to ensure the browser removes it.
 */
export function clearRefreshToken(res: NextResponse): void {
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/api/auth/refresh",
  });
}

/**
 * Clears the access token cookie.
 */
export function clearAccessToken(res: NextResponse): void {
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
}
