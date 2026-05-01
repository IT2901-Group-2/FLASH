import { vi } from "vitest";
import type { UseLanguageReturn } from "@/hooks/useLanguage";

export const defaultLanguageReturn: UseLanguageReturn = {
  locales: ["en", "no"],
  currentLocale: "en",
  nextLocale: "no",
  switchLocale: vi.fn(),
  isSwitching: false,
};

/**
 * Returns a mock result for `useLanguage` with overridable defaults.
 * Useful when you need to test a specific locale state.
 *
 * @example
 * vi.mocked(useLanguage).mockReturnValue(mockLanguageReady({ currentLocale: "no" }));
 * expect(screen.getByText("NO")).toBeInTheDocument();
 */
export const mockLanguageReady = (
  overrides: Partial<UseLanguageReturn> = {}
): UseLanguageReturn => ({
  ...defaultLanguageReturn,
  ...overrides,
});

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useLanguage`.
 *
 * @example
 * // vitest.setup.tsx - register once globally
 * vi.mock("@/hooks/useLanguage", () => languageHookMock());
 *
 * // YourComponent.test.tsx - override per test
 * import { useLanguage } from "@/hooks/useLanguage";
 * import { mockLanguageReady } from "@test-config";
 *
 * vi.mocked(useLanguage).mockReturnValue(mockLanguageReady({ currentLocale: "no" }));
 */
export const languageHookMock = () => ({
  useLanguage: vi.fn(() => ({ ...defaultLanguageReturn })),
});
