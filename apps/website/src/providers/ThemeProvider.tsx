"use client";

import {
  isResolvedTheme,
  THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
  THEME_PREF_COOKIE_KEY,
  THEME_RESOLVED_COOKIE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/config/theme";
import {
  applyTheme,
  getStoredThemePref,
  resolveThemePreference,
  setStoredTheme,
  systemThemeListener,
} from "@/lib/utils/theme-utils";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const COOKIE_OPTIONS = {
  prefCookieKey: THEME_PREF_COOKIE_KEY,
  resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
  cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
} as const;

/**
 * Read the resolved theme that was baked into the document by the server.
 *
 * Returns `null` when running on the server or when the attribute is absent /
 * invalid, so callers can fall back to the configured default.
 */
function getSSRResolvedTheme(): ResolvedTheme | null {
  if (typeof document === "undefined") return null;
  const attr = document.documentElement.getAttribute("data-theme");
  return isResolvedTheme(attr) ? attr : null;
}

/**
 * Get the initial theme state on first render.
 *
 * This reads the SSR-resolved theme when available, falling back to resolving the
 * provided default theme. The returned object contains both the raw preference and
 * the resolved theme to avoid redundant work in the initial effects.
 */
function getInitialState(defaultTheme: Theme): {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
} {
  const theme = getStoredThemePref() ?? defaultTheme;
  const resolvedTheme = getSSRResolvedTheme() ?? resolveThemePreference(theme);
  return { theme, resolvedTheme };
}

export interface ThemeContextType {
  /**
   * Current saved preference
   */
  theme: Theme;
  /**
   * Actual resolved theme after applying system if needed
   */
  resolvedTheme: ResolvedTheme;
  /**
   * Set the preference to an option in {@link Theme}
   */
  setTheme: (theme: Theme) => void;
  /**
   * Quick toggle between light and dark
   *
   * (if 'system' -> resolves to system then toggles opposite of that)
   */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Theme to use before a stored preference is found.
   * Only read on initial mount - changes to this prop after mount are ignored.
   */
  defaultTheme?: Theme;
}

/**
 * ## ThemeProvider
 *
 * Wrap your application with this provider to expose theme state and helpers.
 * It persists a resolved theme cookie and listens to
 * the OS color-scheme changes when the saved preference is `"system"`.
 *
 * Behaviour details:
 * - On mount, `resolvedTheme` is read from the SSR `data-theme` attribute when available.
 * - Otherwise `resolvedTheme` is computed from `defaultTheme`.
 * - When `theme` changes the provider:
 *   1. Applies the resolved theme to the document using {@link applyTheme}.
 *   2. Persists the resolved value using {@link setStoredTheme}.
 * - When `theme === "system"` a system listener is registered to re-apply the
 * resolved theme when the OS preference changes.
 */
export const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) => {
  const [{ theme, resolvedTheme }, setThemeState] = useState(() =>
    getInitialState(defaultTheme)
  );

  useEffect(() => {
    applyTheme(resolvedTheme);
    setStoredTheme(theme, COOKIE_OPTIONS);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    return systemThemeListener("system", {
      onChange: resolved =>
        setThemeState(prev =>
          prev.resolvedTheme === resolved ? prev : { ...prev, resolvedTheme: resolved }
        ),
      cookie: COOKIE_OPTIONS,
    });
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState({ theme: next, resolvedTheme: resolveThemePreference(next) });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  const contextValue = useMemo<ThemeContextType>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
