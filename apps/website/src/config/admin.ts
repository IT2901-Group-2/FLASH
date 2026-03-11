import { JWT_SECRET } from "@/config/jwt";

export const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes (seconds)
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days (seconds)

export const ACCESS_TOKEN_SECRET = JWT_SECRET + ":access";
export const REFRESH_TOKEN_SECRET = JWT_SECRET + ":refresh";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Default";
