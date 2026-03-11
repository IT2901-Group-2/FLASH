export * from "./storage";
export * from "./images";
export * from "./admin";

export const JWT_SECRET = process.env.JWT_SECRET ?? "SUPER_SECRET_KEY";
