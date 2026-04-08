/**
 * vitest.setup.tsx
 *
 * Runs once before all test files (listed in vitest.config.mts setupFiles).
 *
 * RULES UPHELD HERE:
 *  1. vi.mock() factory functions are 100 % self-contained — no references to
 *     imported variables.  Vitest hoists vi.mock() calls above every import
 *     statement, so any imported variable inside a factory is undefined.
 *  2. Only modules that every test benefits from are mocked globally:
 *       - next-intl        -- translate key → key
 *       - next/navigation  -- stub fns; connected to mockRouter in beforeEach
 *     Everything else (hooks, contexts) is mocked per-test file.
 *  3. mockRouter wiring happens in beforeEach, not in the factory, because
 *     imports are fully live by then.
 */

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { mockRouter, resetMockRouter } from "./__mocks__/router.mock";
import { flashUiMock, resetEventCounter, resetImageCounter } from "@test-config";
import {
  redirect,
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
  notFound,
  Image,
  Link,
} from "./__mocks__/next";

/**
 * Spreads the real module so non-mocked exports keep working.
 * useTranslations returns a function that echoes the translation key back.
 *
 * @example
 *  expect(screen.getByText("title"))
 */
vi.mock("next-intl", async importOriginal => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useTranslations: vi.fn(() => (key: string) => key),
    useLocale: vi.fn(() => "en"),
  };
});

/**
 * Mocks next/image with minimal passthrough components.
 *
 * This is necessary because the real next/image relies on browser APIs that
 * are not available in the test environment, and without this mock it throws
 * errors when rendered in tests.
 */
vi.mock("next/image", () => ({ default: Image }));

/**
 * Mocks next/link with a minimal passthrough component.
 *
 * This is necessary because some components (e.g. Button) use next/link
 * internally, and without this mock they throw an error about missing
 * context when rendered in tests.
 */
vi.mock("next/link", () => ({ default: Link }));

/**
 * Mocks all the components in the @flash/ui package. They are replaced
 * by minimal replacements.
 *
 * There is no need to test theme here as they are tested in their
 * own package.
 */
vi.mock("@flash/ui", () => flashUiMock());

/**
 * Factory contains ONLY vi.fn() calls - no reference to any imported variable.
 *
 * Vitest hoists vi.mock() above all imports, so using an imported value here
 * (e.g. mockRouter) would be undefined.  The real return values are wired up
 * in beforeEach below, where imports are already resolved.
 */
vi.mock("next/navigation", () => ({
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
  redirect,
  notFound,
}));

/**
 * Override per-test with vi.stubGlobal or the helpers from @test-config
 *
 * @example
 * vi.stubGlobal("fetch", mockJsonResponse([event]));
 * vi.stubGlobal("fetch", mockUnauthorizedResponse());
 */
export const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

/**
 * By the time beforeEach runs all imports have been resolved, so it is safe to
 * reference mockRouter here and pass it into the mocked navigation hooks.
 */
beforeEach(async () => {
  resetMockRouter();

  // Clear router call history so each test starts from a clean slate.
  // Tests that need to assert on router calls can do so without interference
  // from previous tests.
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
  mockRouter.forward.mockClear();
  mockRouter.refresh.mockClear();
  mockRouter.prefetch.mockClear();

  // Reset fetch so each test controls its own responses.
  mockFetch.mockReset();

  // Reset counters
  resetEventCounter();
  resetImageCounter();

  // Reset all mocks
  vi.resetAllMocks();
});

// ─── afterEach: unmount React trees ─────────────────────────────────────────
afterEach(() => {
  cleanup();
});
