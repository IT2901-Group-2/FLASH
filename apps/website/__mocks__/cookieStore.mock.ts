import { vi } from "vitest";

/**
 * A mock implementation of the Cookie Store API. This is a simple object
 * with jest.fn() for each method.
 *
 * Import and customize the methods you need in your tests.
 *
 * @example
 * import { mockCookieStore } from "@test-config";
 *
 * beforeEach(() => {
 *   mockCookieStore.get.mockResolvedValue({ name: "session", value: "abc123" });
 * }
 */
export const mockCookieStore = {
  addEventListener: vi.fn(),
  delete: vi.fn(),
  dispatchEvent: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(),
  onchange: vi.fn(),
  removeEventListener: vi.fn(),
  set: vi.fn(),
};

/**
 * Resets all cookie store mock functions. Call this in beforeEach.
 *
 * @example
 * beforeEach(() => resetMockCookieStore());
 */
export const resetMockCookieStore = () => {
  mockCookieStore.addEventListener.mockReset();
  mockCookieStore.delete.mockReset();
  mockCookieStore.dispatchEvent.mockReset();
  mockCookieStore.get.mockReset();
  mockCookieStore.getAll.mockReset();
  mockCookieStore.onchange.mockReset();
  mockCookieStore.removeEventListener.mockReset();
  mockCookieStore.set.mockReset();
};
