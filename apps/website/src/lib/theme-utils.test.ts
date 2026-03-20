import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  applyTheme,
  getSystemTheme,
  setStoredTheme,
  systemThemeListener,
} from "./theme-utils";
import {
  isResolvedTheme,
  isTheme,
  THEME_RESOLVED_COOKIE_KEY,
  THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
} from "@/lib/theme-config";

describe("getSystemTheme", () => {
  it("should return 'dark' when system prefers dark mode", () => {
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.stubGlobal("matchMedia", mockMatchMedia);

    const result = getSystemTheme();

    expect(result).toBe("dark");
    expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");

    vi.unstubAllGlobals();
  });

  it("should return 'light' when system prefers light mode", () => {
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.stubGlobal("matchMedia", mockMatchMedia);

    const result = getSystemTheme();

    expect(result).toBe("light");
    expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");

    vi.unstubAllGlobals();
  });

  it("should return 'light' when window is undefined", () => {
    const originalWindow = global.window;
    // @ts-expect-error - intentionally setting to undefined
    delete global.window;
    const result = getSystemTheme();
    expect(result).toBe("light");
    global.window = originalWindow;
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "");
  });

  it("should set data-theme attribute to 'light' on body", () => {
    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should set data-theme attribute to 'dark' on body", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should update existing data-theme attribute", () => {
    document.documentElement.setAttribute("data-theme", "light");
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
  it("should do nothing when document is undefined", () => {
    const originalDocument = global.document;
    // @ts-expect-error - intentionally setting to undefined
    delete global.document;
    expect(() => applyTheme("dark")).not.toThrow();
    global.document = originalDocument;
  });
});

describe("isTheme", () => {
  it("should return true for valid theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(true);
  });

  it("should return false for invalid values", () => {
    expect(isTheme("invalid")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

describe("isResolvedTheme", () => {
  it("should return true for valid resolved theme values", () => {
    expect(isResolvedTheme("light")).toBe(true);
    expect(isResolvedTheme("dark")).toBe(true);
  });

  it("should return false for invalid values", () => {
    expect(isResolvedTheme("system")).toBe(false);
    expect(isResolvedTheme("invalid")).toBe(false);
    expect(isResolvedTheme(null)).toBe(false);
  });
});

describe("setStoredTheme", () => {
  beforeEach(() => {
    document.cookie = `${THEME_RESOLVED_COOKIE_KEY}=; Max-Age=0; Path=/`;
  });

  it("should persist resolved cookie for light theme", () => {
    setStoredTheme("light", undefined, {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=light`);
  });

  it("should persist resolved cookie for dark theme", () => {
    setStoredTheme("dark", undefined, {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=dark`);
  });

  it("should persist resolved cookie for system theme", () => {
    setStoredTheme("system", undefined, {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(document.cookie).toContain(THEME_RESOLVED_COOKIE_KEY);
  });

  it("should persist resolved theme cookie", () => {
    setStoredTheme("dark", "dark", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=dark`);
  });
});

describe("systemThemeListener", () => {
  let mockMediaQuery: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockMediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia = vi.fn().mockReturnValue(mockMediaQuery);
    vi.stubGlobal("matchMedia", mockMatchMedia);
    document.documentElement.setAttribute("data-theme", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should register event listener when theme is 'system'", () => {
    const cleanup = systemThemeListener("system", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    cleanup();
  });

  it("should not register event listener when theme is 'light'", () => {
    const cleanup = systemThemeListener("light");

    expect(mockMatchMedia).not.toHaveBeenCalled();
    expect(mockMediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it("should not register event listener when theme is 'dark'", () => {
    const cleanup = systemThemeListener("dark");

    expect(mockMatchMedia).not.toHaveBeenCalled();
    expect(mockMediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it("should apply theme when system preference changes", () => {
    systemThemeListener("system", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    const handler = mockMediaQuery.addEventListener.mock.calls[0]?.[1] as
      | (() => void)
      | undefined;
    expect(handler).toBeDefined();
    mockMediaQuery.matches = true;
    handler?.();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should remove event listener when cleanup function is called", () => {
    const cleanup = systemThemeListener("system", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(mockMediaQuery.addEventListener).toHaveBeenCalled();

    cleanup();

    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should return no-op cleanup function when theme is not 'system'", () => {
    const cleanup = systemThemeListener("light");

    // Should not throw
    expect(() => cleanup()).not.toThrow();
    expect(mockMediaQuery.removeEventListener).not.toHaveBeenCalled();
  });

  it("should handle multiple listener registrations and cleanups", () => {
    const cleanup1 = systemThemeListener("system", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });
    const cleanup2 = systemThemeListener("system", {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });

    expect(mockMediaQuery.addEventListener).toHaveBeenCalledTimes(2);

    cleanup1();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(1);

    cleanup2();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
