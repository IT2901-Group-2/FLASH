import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  systemThemeListner,
} from "./theme-utils";
import { THEME_STORAGE_KEY } from "@/providers/ThemeProvider";

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

describe("getStoredTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return stored theme from localStorage", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const result = getStoredTheme();
    expect(result).toBe("dark");
  });

  it("should return 'light' when stored", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    const result = getStoredTheme();
    expect(result).toBe("light");
  });

  it("should return 'system' when stored", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "system");
    const result = getStoredTheme();
    expect(result).toBe("system");
  });

  it("should return null when no theme is stored", () => {
    const result = getStoredTheme();
    expect(result).toBeNull();
  });

  it("should return null when window is undefined", () => {
    const originalWindow = global.window;
    // @ts-expect-error - intentionally setting to undefined for SSR test
    delete global.window;

    const result = getStoredTheme();
    expect(result).toBeNull();
    global.window = originalWindow;
  });
});

describe("setStoredTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should store 'light' theme in localStorage", () => {
    setStoredTheme("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("should store 'dark' theme in localStorage", () => {
    setStoredTheme("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("should store 'system' theme in localStorage", () => {
    setStoredTheme("system");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });

  it("should overwrite existing theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    setStoredTheme("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});

describe("systemThemeListner", () => {
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
    const cleanup = systemThemeListner("system");

    expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    cleanup();
  });

  it("should not register event listener when theme is 'light'", () => {
    const cleanup = systemThemeListner("light");

    expect(mockMatchMedia).not.toHaveBeenCalled();
    expect(mockMediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it("should not register event listener when theme is 'dark'", () => {
    const cleanup = systemThemeListner("dark");

    expect(mockMatchMedia).not.toHaveBeenCalled();
    expect(mockMediaQuery.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it("should apply theme when system preference changes", () => {
    systemThemeListner("system");

    const handler = mockMediaQuery.addEventListener.mock.calls[0][1];
    mockMediaQuery.matches = true;
    handler();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should remove event listener when cleanup function is called", () => {
    const cleanup = systemThemeListner("system");

    expect(mockMediaQuery.addEventListener).toHaveBeenCalled();

    cleanup();

    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should return no-op cleanup function when theme is not 'system'", () => {
    const cleanup = systemThemeListner("light");

    // Should not throw
    expect(() => cleanup()).not.toThrow();
    expect(mockMediaQuery.removeEventListener).not.toHaveBeenCalled();
  });

  it("should handle multiple listener registrations and cleanups", () => {
    const cleanup1 = systemThemeListner("system");
    const cleanup2 = systemThemeListner("system");

    expect(mockMediaQuery.addEventListener).toHaveBeenCalledTimes(2);

    cleanup1();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(1);

    cleanup2();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
