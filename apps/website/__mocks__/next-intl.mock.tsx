import { vi } from "vitest";

export const useTranslations = vi.fn(
  () => (key: string, _values?: Record<string, string | number>) => key
);

export const useLocale = vi.fn(() => "en");
