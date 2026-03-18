/**
 * Auto-mock for next-intl.
 *
 * When a test calls `vi.mock("next-intl")` with no factory, Vitest resolves
 * this file automatically. useTranslations returns a translator that echoes
 * back the translation key, making assertions straightforward:
 *
 *   expect(screen.getByText("title")).toBeInTheDocument();
 *
 * For tests that need parameterised translations, override inline:
 *
 *   vi.mock("next-intl", async (importOriginal) => ({
 *     ...(await importOriginal()),
 *     useTranslations: () => (key, values) => { ... },
 *   }));
 */
import { vi } from "vitest";
import * as actual from "next-intl";

export const useTranslations = vi.fn(
  () => (key: string, _values?: Record<string, string | number>) => key
);

export const useLocale = vi.fn(() => "en");
export const useNow = vi.fn(() => new Date("2026-01-01T00:00:00.000Z"));
export const useFormatter = vi.fn(() => ({}));

// Re-export everything else from the real module so non-mocked parts work
const { useTranslations: _ut, useLocale: _ul, ...rest } = actual;
export default rest;
