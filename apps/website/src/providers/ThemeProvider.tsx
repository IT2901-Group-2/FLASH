"use client";

import {
  applyTheme,
  resolveThemePreference,
  setStoredTheme,
  systemThemeListener,
} from "@/lib/theme-utils";
import {
  isResolvedTheme,
  THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
  THEME_RESOLVED_COOKIE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme-config";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

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

/**
 * Consume the theme context.
 *
 * @throws {Error} When called outside of a ThemeProvider tree.
 */
export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};

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
  const getInitialResolvedTheme = (): ResolvedTheme | null => {
    if (typeof document !== "undefined") {
      const ssrResolvedTheme = document.documentElement.getAttribute("data-theme");
      if (isResolvedTheme(ssrResolvedTheme)) {
        return ssrResolvedTheme;
      }
    }

    return null;
  };

  const getInitialTheme = (): Theme => {
    const initialResolvedTheme = getInitialResolvedTheme();
    if (initialResolvedTheme !== null) return initialResolvedTheme;

    return defaultTheme;
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const initialResolvedTheme = getInitialResolvedTheme();
    if (initialResolvedTheme !== null) return initialResolvedTheme;

    return resolveThemePreference(getInitialTheme());
  });

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    setStoredTheme(theme, resolvedTheme, {
      resolvedCookieKey: THEME_RESOLVED_COOKIE_KEY,
      cookieMaxAgeSeconds: THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS,
    });
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    const resolved = resolveThemePreference(next);
    setThemeState(next);
    setResolvedTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    return systemThemeListener(theme, { onChange: setResolvedTheme });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
