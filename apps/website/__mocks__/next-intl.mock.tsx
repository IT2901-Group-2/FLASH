import { vi } from "vitest";
import * as actual from "next-intl";

export const useTranslations = vi.fn(
  () => (key: string, _values?: Record<string, string | number>) => key
);

export const useLocale = vi.fn(() => "en");
export const useNow = vi.fn(() => new Date());
export const useFormatter = vi.fn(() => ({}));

// Re-export everything else from the real module so non-mocked parts work
const { useTranslations: _ut, useLocale: _ul, ...rest } = actual;
export default rest;
