import { cookies } from "next/dist/server/request/cookies";
import {
  isTheme,
  THEME_PREF_COOKIE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/config/theme";
import { AsyncResult, Result } from "typescript-result";

/**
 * Persist a resolved theme value as a cookie.
 *
 * Works in both browser and server (Next.js) environments.
 *
 * @param name - Cookie name.
 * @param value - Cookie value.
 * @param maxAgeSeconds - Cookie lifetime in seconds.
 */
export const setThemeCookie = ({
  name,
  value,
  maxAgeSeconds,
}: {
  name: string;
  value: string;
  maxAgeSeconds: number;
}): AsyncResult<void, Error> => {
  if (typeof document !== "undefined") {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
    return Result.fromAsync(async () => {});
  }

  return Result.fromAsync(async () => {
    const cs = await cookies();
    cs.set(name, value, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAgeSeconds,
    });
  });
};

/**
 * Get the current system color scheme preference.
 *
 * This checks the browser's `(prefers-color-scheme: dark)` media query.
 * When rendered on the server (no `window`), it returns `"light"` (safe default).
 *
 * @returns "light" | "dark" - `"dark"` if the user's OS/browser prefers dark mode, otherwise `"light"`.
 */
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Resolve a theme preference to a concrete `"light"` or `"dark"` value.
 *
 * When the theme is `"system"`, the current OS preference is used.
 *
 * @param theme - The stored theme preference.
 * @returns The concrete resolved theme.
 */
export const resolveThemePreference = (theme: Theme): ResolvedTheme =>
  theme === "system" ? getSystemTheme() : theme;

/**
 * Apply a resolved theme to the document.
 *
 * This sets a `data-theme` attribute on the document element which you can target in CSS.
 *
 * Safe in SSR: no-op when `document` is not available.
 *
 * @param resolvedTheme - The concrete theme to apply: `"light"` or `"dark"`.
 */
export const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.style.colorScheme = resolvedTheme;
};

/**
 * Persist the current theme preference as a cookie.
 *
 * Resolves `theme` via {@link resolveThemePreference} when no explicit
 * `resolvedTheme` is provided.
 *
 * @param theme - The theme preference to store.
 * @param cookieOptions - Cookie key and lifetime configuration.
 * @returns An `AsyncResult` that callers can use to observe or handle failures.
 */
export const setStoredTheme = (
  theme: Theme,
  cookieOptions: {
    prefCookieKey: string;
    resolvedCookieKey: string;
    cookieMaxAgeSeconds: number;
  }
): AsyncResult<void, Error> => {
  const resolved = resolveThemePreference(theme);
  setThemeCookie({
    name: cookieOptions.prefCookieKey,
    value: theme,
    maxAgeSeconds: cookieOptions.cookieMaxAgeSeconds,
  });
  return setThemeCookie({
    name: cookieOptions.resolvedCookieKey,
    value: resolved,
    maxAgeSeconds: cookieOptions.cookieMaxAgeSeconds,
  });
};

export const getStoredThemePref = (): Theme | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${THEME_PREF_COOKIE_KEY}=`));
  if (match === undefined) return null;
  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return isTheme(value) ? value : null;
};

/** Options for {@link systemThemeListener}. */
export interface SystemThemeListenerOptions {
  /**
   * Called after the theme is applied and the cookie is updated whenever the
   * OS color scheme changes. The listener always applies the theme
   * and updates the cookie regardless of whether this is provided.
   */
  onChange?: (resolvedTheme: ResolvedTheme) => void;
  /**
   * When provided, the resolved-theme cookie is updated on every OS theme
   * change so server-rendered responses stay in sync.
   */
  cookie?: { resolvedCookieKey: string; cookieMaxAgeSeconds: number };
}

/**
 * Register a listener for OS color scheme changes when the stored theme is `"system"`.
 *
 * On every change the listener will, in order:
 * 1. Apply the new resolved theme to the document via {@link applyTheme}.
 * 2. Update the resolved-theme cookie (when `cookie` options are provided).
 * 3. Invoke `onChange` (when provided).
 *
 * Returns a cleanup function when `theme !== "system"` or when called
 * outside a browser context.
 *
 * @param theme - If `"system"`, a `(prefers-color-scheme)` listener is registered.
 * @param options - Optional callback and/or cookie config.
 * @returns Cleanup function that removes the media query listener.
 */
export const systemThemeListener = (
  theme: Theme,
  options?: SystemThemeListenerOptions
): (() => void) => {
  if (typeof window === "undefined" || theme !== "system") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = () => {
    const resolved = getSystemTheme();

    applyTheme(resolved);

    if (options?.cookie !== undefined) {
      setThemeCookie({
        name: options.cookie.resolvedCookieKey,
        value: resolved,
        maxAgeSeconds: options.cookie.cookieMaxAgeSeconds,
      });
    }

    options?.onChange?.(resolved);
  };

  mediaQuery.addEventListener("change", handler);
  handler();
  return () => mediaQuery.removeEventListener("change", handler);
};
