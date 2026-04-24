import { vi } from "vitest";

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useIsMounted`.
 *
 * Default return value is `true` (mounted), matching the client-side
 * behaviour of `useSyncExternalStore`.
 *
 * @example
 * // Register once at the top of a test file
 * vi.mock("@/hooks/useIsMounted", () => isMountedHookMock());
 *
 * // Override per test to simulate the SSR / pre-hydration state
 * import { useIsMounted } from "@/hooks/useIsMounted";
 *
 * vi.mocked(useIsMounted).mockReturnValue(false);
 */
export const isMountedHookMock = () => ({
  useIsMounted: vi.fn(() => true),
});

/**
 * Convenience return value for the mounted state.
 *
 * @example
 * vi.mocked(useIsMounted).mockReturnValue(MOUNTED);
 */
export const MOUNTED = true;

/**
 * Convenience return value for the unmounted / pre-hydration state.
 *
 * @example
 * vi.mocked(useIsMounted).mockReturnValue(UNMOUNTED);
 */
export const UNMOUNTED = false;
