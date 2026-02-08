"use client";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  systemThemeListner,
} from "@/lib/theme-utils";
import { createContext, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "theme";

export type ResolvedTheme = "light" | "dark";
export type Theme = "system" | ResolvedTheme;

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
  defaultTheme?: Theme;
}

/**
 * ## ThemeProvider
 *
 * Wrap your application with this provider to expose theme state and helpers.
 * It integrates with `localStorage` (via {@link THEME_STORAGE_KEY}) and listens to
 * the OS color-scheme changes when the saved preference is `"system"`.
 *
 * Behaviour details:
 * - On mount the provider reads the persisted preference (via {@link getStoredTheme}).
 * - The `resolvedTheme` is computed: if `theme === "system"` the OS preference
 * (via {@link getSystemTheme}) is used, otherwise the explicit value is used.
 * - When `theme` changes the provider:
 *   1. Applies the resolved theme to the document using {@link applyTheme}.
 *   2. Persists the selected preference using {@link setStoredTheme}.
 * - When `theme === "system"` a system listener is registered to re-apply the
 * resolved theme when the OS preference changes.
 */
export const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme() ?? defaultTheme);

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    return theme === "system" ? getSystemTheme() : theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const effective = prev === "system" ? getSystemTheme() : prev;
      return effective === "dark" ? "light" : "dark";
    });
  };

  useEffect(() => {
    if (theme === "system") applyTheme(getSystemTheme());
    else applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  useEffect(() => {
    return systemThemeListner(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
