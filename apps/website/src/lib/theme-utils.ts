import Error from "next/dist/pages/_error";
import { cookies } from "next/dist/server/request/cookies";
import type { ResolvedTheme, Theme } from "@/lib/theme-config";
import { AsyncResult, Result } from "typescript-result";

export function setThemeCookie({
  name,
  value,
  maxAgeSeconds,
}: {
  name: string;
  value: string;
  maxAgeSeconds: number;
}): AsyncResult<void, Error> {
  if (typeof document !== "undefined") {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    return Result.fromAsync(async () => {
      document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
    });
  }

  return Result.try(cookies).map(cs =>
    Result.try(() => {
      cs.set(name, value, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAgeSeconds,
      });
    })
  );
}

/**
 * Get the current system color scheme preference.
 *
 * This checks the browser's `(prefers-color-scheme: dark)` media query.
 * - When rendered on the server (no `window`), it returns `"light"` (safe default).
 *
 * @returns "light" | "dark" - `"dark"` if the user's OS/browser prefers dark mode, otherwise `"light"`.
 */
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const resolveThemePreference = (theme: Theme): ResolvedTheme => {
  return theme === "system" ? getSystemTheme() : theme;
};

/**
 * Apply a resolved theme to the document.
 *
 * This sets a `data-theme` attribute on the body element which you can target in CSS.
 *
 * Safe in SSR: no-op when `document` is not available.
 *
 * @param {ResolvedTheme} {@link ResolvedTheme} - The theme to apply; expected `"light"` or `"dark"`.
 * @returns {void} void
 */
export const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.style.colorScheme = resolvedTheme;
};

/**
 * Persist a resolved theme using cookies.
 *
 * @param {Theme} {@link Theme} - The theme to store (e.g. `"light"`, `"dark"`, `"system"`).
 * @returns {void}
 */
export const setStoredTheme = (
  theme: Theme,
  resolvedTheme: ResolvedTheme | undefined,
  {
    resolvedCookieKey,
    cookieMaxAgeSeconds,
  }: {
    resolvedCookieKey: string;
    cookieMaxAgeSeconds: number;
  }
): void => {
  const resolved = resolvedTheme ?? (theme === "system" ? getSystemTheme() : theme);
  setThemeCookie({
    name: resolvedCookieKey,
    value: resolved,
    maxAgeSeconds: cookieMaxAgeSeconds,
  });
};

/**
 * Registers a listener for system color scheme changes when the selected theme is `"system"`.
 *
 * When active, this listens to the `(prefers-color-scheme: dark)` media query and
 * reapplies the resolved system theme (`"light"` or `"dark"`) whenever it changes.
 * It also updates the theme cookie so that server-rendered responses stay
 * in sync with the current preference.
 *
 * @param {Theme} {@link theme} - If this equals `"system"`, a listener will be registered to track OS theme changes.
 * @param options.onChange Optional callback when the system theme changes.
 * When omitted, the listener applies the theme, and if cookie options are provided,
 * also updates the resolved-theme cookie internally.
 * @returns {() => void} Cleanup function that removes the media query listener.
 */
export const systemThemeListener = (
  theme: Theme,
  options?: {
    onChange?: (resolvedTheme: ResolvedTheme) => void;
    resolvedCookieKey?: string;
    cookieMaxAgeSeconds?: number;
  }
) => {
  if (
    typeof window === "undefined" ||
    theme !== "system" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = () => {
    const resolved = getSystemTheme();

    if (options?.onChange !== undefined) {
      options.onChange(resolved);
      return;
    }

    applyTheme(resolved);
    if (
      options?.resolvedCookieKey !== undefined &&
      options.cookieMaxAgeSeconds !== undefined
    ) {
      setThemeCookie({
        name: options.resolvedCookieKey,
        value: resolved,
        maxAgeSeconds: options.cookieMaxAgeSeconds,
      });
    }
  };

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
};
