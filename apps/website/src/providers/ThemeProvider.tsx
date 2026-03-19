"use client";

import {
  applyTheme,
  getStoredTheme,
  resolveThemePreference,
  setStoredTheme,
  systemThemeListener,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme-utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
 * It integrates with `localStorage` and listens to
 * the OS color-scheme changes when the saved preference is `"system"`.
 *
 * Behaviour details:
 * - On mount the provider reads the persisted preference (via {@link getStoredTheme}).
 * - The `resolvedTheme` is computed: if `theme === "system"` the OS preference
 * (via {@link getSystemTheme}) is used, otherwise the explicit value is used.
 * - When `theme` changes the provider:
 *   1. Applies the resolved theme to the document using {@link applyTheme}.
 *   2. Persists the selected preference and resolved value using {@link setStoredTheme}.
 * - When `theme === "system"` a system listener is registered to re-apply the
 * resolved theme when the OS preference changes.
 */
export const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme() ?? defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveThemePreference(getStoredTheme() ?? defaultTheme)
  );

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    const resolved = resolveThemePreference(next);
    applyTheme(resolved);
    setStoredTheme(next, resolved);
    setThemeState(next);
    setResolvedTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const cleanup = systemThemeListener(theme);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedTheme(resolveThemePreference("system"));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      cleanup();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
