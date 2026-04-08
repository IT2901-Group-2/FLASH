import { vi } from "vitest";

/**
 * A shared mock router instance.
 * Import this in tests that assert on navigation calls.
 *
 * @example
 * import { mockRouter } from "@test-config";
 *
 * it("navigates back", () => {
 *   fireEvent.click(screen.getByTestId("back-button"));
 *   expect(mockRouter.back).toHaveBeenCalledTimes(1);
 * });
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: "/",
  query: {},
};

/**
 * Resets all router mock functions. Call this in beforeEach.
 *
 * @example
 * beforeEach(() => resetMockRouter());
 */
export const resetMockRouter = () => {
  mockRouter.push.mockReset();
  mockRouter.replace.mockReset();
  mockRouter.prefetch.mockReset();
  mockRouter.back.mockReset();
  mockRouter.forward.mockReset();
  mockRouter.refresh.mockReset();
  mockRouter.pathname = "/";
  mockRouter.query = {};
};
