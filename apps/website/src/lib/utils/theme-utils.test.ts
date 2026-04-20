import {
  THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
  THEME_PREF_COOKIE_KEY,
  THEME_RESOLVED_COOKIE_KEY,
} from "@/config/theme";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  getSystemTheme,
  isResolvedTheme,
  isTheme,
  setStoredTheme,
  systemThemeListener,
} from "./theme-utils";

/* Helpers /*

/**
 * Build a `matchMedia` stub.
 *
 * @param prefersDark - Whether the mock should report a dark-mode preference.
 */
function makeMatchMedia(prefersDark: boolean) {
  const mediaQuery = {
    matches: prefersDark,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  const matchMedia = vi.fn().mockReturnValue(mediaQuery);
  return { matchMedia, mediaQuery };
}

/* getSystemTheme */

describe("getSystemTheme", () => {
  it("returns 'dark' when the OS prefers dark mode", () => {
    const { matchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", matchMedia);

    expect(getSystemTheme()).toBe("dark");
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
  });

  it("returns 'light' when the OS prefers light mode", () => {
    const { matchMedia } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    expect(getSystemTheme()).toBe("light");
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
  });

  it("returns 'light' when window is undefined (SSR)", () => {
    const originalWindow = global.window;
    // @ts-expect-error — intentionally simulating SSR environment
    delete global.window;

    expect(getSystemTheme()).toBe("light");

    global.window = originalWindow;
  });
});

/* applyTheme */

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("sets data-theme to 'light' on the root element", () => {
    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("sets data-theme to 'dark' on the root element", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates an existing data-theme attribute", () => {
    document.documentElement.setAttribute("data-theme", "light");
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("does nothing when document is undefined (SSR)", () => {
    const originalDocument = global.document;
    // @ts-expect-error - intentionally simulating SSR environment
    delete global.document;
    expect(() => applyTheme("dark")).not.toThrow();
    global.document = originalDocument;
  });
});

/* isTheme */

describe("isTheme", () => {
  it("returns true for valid theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(true);
  });

  it("returns false for invalid values", () => {
    expect(isTheme("invalid")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

/* isResolvedTheme */

describe("isResolvedTheme", () => {
  it("returns true for valid resolved theme values", () => {
    expect(isResolvedTheme("light")).toBe(true);
    expect(isResolvedTheme("dark")).toBe(true);
  });

  it("returns false for invalid values", () => {
    expect(isResolvedTheme("system")).toBe(false);
    expect(isResolvedTheme("invalid")).toBe(false);
    expect(isResolvedTheme(null)).toBe(false);
  });
});

/* setStoredTheme */

describe("setStoredTheme", () => {
  const cookieOptions = {
    prefCookieKey: THEME_PREF_COOKIE_KEY,
    resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
    cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
  };

  beforeEach(() => {
    document.cookie = `${THEME_RESOLVED_COOKIE_KEY}=`;
  });

  it("persists 'light' as the resolved cookie value for the light theme", () => {
    setStoredTheme("light", cookieOptions);
    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=light`);
  });

  it("persists 'dark' as the resolved cookie value for the dark theme", () => {
    setStoredTheme("dark", cookieOptions);
    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=dark`);
  });

  it("persists 'light' as the resolved cookie value for system theme when OS prefers light", () => {
    const { matchMedia } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    setStoredTheme("system", cookieOptions);

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=light`);
  });

  it("persists 'dark' as the resolved cookie value for system theme when OS prefers dark", () => {
    const { matchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", matchMedia);

    setStoredTheme("system", cookieOptions);

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=dark`);
  });
});

/* systemThemeListener */

describe("systemThemeListener", () => {
  let mediaQuery: ReturnType<typeof makeMatchMedia>["mediaQuery"];
  let matchMedia: ReturnType<typeof makeMatchMedia>["matchMedia"];

  const listenerOptions = {
    cookie: {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    },
  };

  beforeEach(() => {
    ({ matchMedia, mediaQuery } = makeMatchMedia(false));
    vi.stubGlobal("matchMedia", matchMedia);
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    document.cookie = `${THEME_RESOLVED_COOKIE_KEY}=`;
  });

  // Registration

  it("registers a change listener when theme is 'system'", () => {
    const cleanup = systemThemeListener("system", listenerOptions);

    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    cleanup();
  });

  it("does not register a listener when theme is 'light'", () => {
    const cleanup = systemThemeListener("light");

    expect(matchMedia).not.toHaveBeenCalled();
    expect(mediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it("does not register a listener when theme is 'dark'", () => {
    const cleanup = systemThemeListener("dark");

    expect(matchMedia).not.toHaveBeenCalled();
    expect(mediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  // SSR guard

  it("returns a no-op and does not throw when window is undefined (SSR)", () => {
    const originalWindow = global.window;
    // @ts-expect-error - intentionally simulating SSR environment
    delete global.window;

    let cleanup!: () => void;
    expect(() => {
      cleanup = systemThemeListener("system", listenerOptions);
    }).not.toThrow();
    expect(() => cleanup()).not.toThrow();

    global.window = originalWindow;
  });

  // OS change handling

  it("applies the resolved theme to the document when the OS preference changes", () => {
    systemThemeListener("system", listenerOptions);

    const { matchMedia: darkMatchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", darkMatchMedia);

    const handler = mediaQuery.addEventListener.mock.calls[0]?.[1] as () => void;
    expect(handler).toBeDefined();
    handler();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates the resolved cookie when the OS preference changes", () => {
    systemThemeListener("system", listenerOptions);

    const { matchMedia: darkMatchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", darkMatchMedia);

    const handler = mediaQuery.addEventListener.mock.calls[0]?.[1] as () => void;
    handler();

    expect(document.cookie).toContain(`${THEME_RESOLVED_COOKIE_KEY}=dark`);
  });

  it("invokes onChange after applying the theme and updating the cookie", () => {
    const onChange = vi.fn();
    const callOrder: string[] = [];

    const originalSetAttribute = document.documentElement.setAttribute.bind(
      document.documentElement
    );
    vi.spyOn(document.documentElement, "setAttribute").mockImplementation(
      (name, value) => {
        if (name === "data-theme") callOrder.push("applyTheme");
        originalSetAttribute(name, value);
      }
    );
    onChange.mockImplementation(() => callOrder.push("onChange"));

    systemThemeListener("system", { ...listenerOptions, onChange });

    onChange.mockClear();
    callOrder.length = 0;

    const { matchMedia: darkMatchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", darkMatchMedia);

    const handler = mediaQuery.addEventListener.mock.calls[0]?.[1] as () => void;
    handler();

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("dark");
    expect(callOrder).toEqual(["applyTheme", "onChange"]);

    vi.restoreAllMocks();
  });

  // Cleanup

  it("removes the change listener when the cleanup function is called", () => {
    const cleanup = systemThemeListener("system", listenerOptions);
    cleanup();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("cleanup is a no-op and does not throw when theme is not 'system'", () => {
    const cleanup = systemThemeListener("light");

    expect(() => cleanup()).not.toThrow();
    expect(mediaQuery.removeEventListener).not.toHaveBeenCalled();
  });

  it("handles multiple independent registrations and cleanups correctly", () => {
    const cleanup1 = systemThemeListener("system", listenerOptions);
    const cleanup2 = systemThemeListener("system", listenerOptions);

    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(2);

    cleanup1();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(1);

    cleanup2();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
