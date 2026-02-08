"use client";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
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

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
