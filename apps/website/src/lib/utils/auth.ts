import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Environment validation:
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} not defined`);
  }
  return value;
}
export const env = {
  ADMIN_PASSWORD: requireEnv("ADMIN_PASSWORD"),
  ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
// Config:
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes (seconds)
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days (seconds)

const isProduction = env.NODE_ENV === "production";

// Types
export type TokenPayload = {
  admin: true;
};

// Password verfication
export async function verifyLogin(password: string): Promise<boolean> {
  const hash = (s: string) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(hash(env.ADMIN_PASSWORD), hash(password));
}

// Token signing
export function signAccessToken(): {
  accessToken: string;
  expiresIn: number;
} {
  const accessToken = jwt.sign({ admin: true }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  return {
    accessToken,
    expiresIn: ACCESS_TOKEN_EXPIRY * 1000,
  };
}

export function signRefreshToken(res: NextResponse): void {
  const refreshToken = jwt.sign({ admin: true }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY,
    path: "/api/auth/refresh",
  });
}

// Token verification
function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>).admin === true
  );
}

export function verifyAccessToken(req: NextRequest): TokenPayload {
  const header = req.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    throw new Error("Missing access token");
  }

  const token = header.slice(7);

  if (!token) {
    throw new Error("Missing access token");
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    if (!isTokenPayload(decoded)) {
      throw new Error("Invalid token payload");
    }

    return decoded;
  } catch {
    throw new Error("Invalid or expired access token");
  }
}

export function verifyRefreshToken(req: NextRequest): TokenPayload | null {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    if (!isTokenPayload(decoded)) {
      throw new Error("Invalid token payload");
    }
    return decoded;
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
}

// Logout
export function clearRefreshToken(res: NextResponse): void {
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 0,
    path: "/api/auth/refresh",
  });
}
