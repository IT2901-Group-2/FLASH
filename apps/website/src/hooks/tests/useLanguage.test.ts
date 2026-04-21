import {
  createNextIntlLanguageWrapper,
  mockRouter,
  useLocale,
  usePathname,
  useSearchParams,
} from "@test-config";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLanguage } from "../useLanguage";
import { routing } from "@/i18n/routing";
import { act } from "react";

vi.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["en", "no"],
    defaultLocale: "en",
  },
}));

describe("useLanguage", () => {
  let wrapper: ReturnType<typeof createNextIntlLanguageWrapper>;

  beforeEach(() => {
    wrapper = createNextIntlLanguageWrapper();
  });

  describe("return values", () => {
    it("returns the full locales list from routing config", () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.locales).toStrictEqual(routing.locales);
    });

    it("returns the current locale when it is valid", () => {
      useLocale.mockReturnValue("en");
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.currentLocale).toBe("en");
    });

    it("falls back to defaultLocale when the locale is not in the list", () => {
      useLocale.mockReturnValue("de");
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.currentLocale).toBe(routing.defaultLocale);
    });

    it("returns the next locale (the one that is not current)", () => {
      useLocale.mockReturnValue("en");
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.nextLocale).toBe("no");
    });

    it("nextLocale changes when the current locale changes", () => {
      useLocale.mockReturnValue("no");
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.nextLocale).toBe("en");
    });

    it("exposes a switchLocale function", () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(typeof result.current.switchLocale).toBe("function");
    });
  });

  describe("switchLocale", () => {
    it("calls router.replace with the current pathname and next locale", () => {
      usePathname.mockReturnValue("/events");

      const { result } = renderHook(() => useLanguage(), { wrapper });
      act(() => result.current.switchLocale());

      expect(mockRouter.replace).toHaveBeenCalledWith("/no/events");
    });

    it("calls router.refresh after replace", () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      act(() => result.current.switchLocale());

      expect(mockRouter.refresh).toHaveBeenCalledOnce();
    });

    it("switches to en when the current locale is no", () => {
      useLocale.mockReturnValue("no");
      usePathname.mockReturnValue("/events");

      const { result } = renderHook(() => useLanguage(), { wrapper });
      act(() => result.current.switchLocale());

      expect(mockRouter.replace).toHaveBeenCalledWith("/en/events");
    });

    it("preserves existing search params in the href", () => {
      usePathname.mockReturnValue("/events");
      useSearchParams.mockReturnValue(new URLSearchParams("tab=photos&page=2"));

      const { result } = renderHook(() => useLanguage(), { wrapper });
      act(() => result.current.switchLocale());

      expect(mockRouter.replace).toHaveBeenCalledWith("/no/events?tab=photos&page=2");
    });

    it("does nothing when there is no nextLocale", () => {
      vi.mocked(routing).locales = ["en"] as unknown as typeof routing.locales;
      useLocale.mockReturnValue("en");

      const { result } = renderHook(() => useLanguage(), { wrapper });
      act(() => result.current.switchLocale());

      expect(mockRouter.replace).not.toHaveBeenCalled();
      expect(mockRouter.refresh).not.toHaveBeenCalled();

      vi.mocked(routing).locales = ["en", "no"] as unknown as typeof routing.locales;
    });
  });
});
