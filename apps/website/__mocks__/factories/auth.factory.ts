import { Auth } from "@/actions/auth";

/**
 * Creates a fully-populated `Auth` object.
 *
 * @param overrides An object used to override the properties of the returned object.
 * @returns An `Auth` object.
 */
export const makeAuth = (overrides: Partial<Auth> = {}): Auth => ({
  isAdmin: false,
  ...overrides,
});
