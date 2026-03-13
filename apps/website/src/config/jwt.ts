export const JWT_SECRET = process.env.JWT_SECRET ?? "SUPER_SECRET_KEY";
export const COOKIE_OPTIONS = { secure: true, maxAge: 10 * 24 * 60 * 60 } as const;
