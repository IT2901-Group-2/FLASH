import { vi } from "vitest";
import type { ThemeContextType } from "@/providers/ThemeProvider";

export const defaultThemeReturn: ThemeContextType = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: vi.fn(),
  toggleTheme: vi.fn(),
};

/**
 * Returns a mock result for `useTheme` with overridable defaults.
 *
 * @example
 * vi.mocked(useTheme).mockReturnValue(mockThemeReady({ resolvedTheme: "dark" }));
 */
export const mockThemeReady = (
  overrides: Partial<ThemeContextType> = {}
): ThemeContextType => ({
  ...defaultThemeReturn,
  ...overrides,
});

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useTheme`.
 *
 * @example
 * // Register once globally in vitest.setup.tsx
 * vi.mock("@/hooks/useTheme", () => themeHookMock());
 *
 * // Override per test
 * import { useTheme } from "@/hooks/useTheme";
 * import { mockThemeReady } from "@test-config";
 *
 * vi.mocked(useTheme).mockReturnValue(mockThemeReady({ resolvedTheme: "dark" }));
 */
export const themeHookMock = () => ({
  useTheme: vi.fn(() => ({ ...defaultThemeReturn })),
});
