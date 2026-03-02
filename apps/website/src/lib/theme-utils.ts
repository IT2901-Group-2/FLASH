import { ResolvedTheme, Theme, THEME_STORAGE_KEY } from "@/providers/ThemeProvider";

/**
 * Get the current system color scheme preference.
 *
 * This checks the browser's `(prefers-color-scheme: dark)` media query.
 * - When rendered on the server (no `window`), it returns `"light"` (safe default).
 *
 * @returns "light" | "dark" - `"dark"` if the user's OS/browser prefers dark mode, otherwise `"light"`.
 */
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 *
 * Apply a resolved theme to the document.
 *
 * This sets a `data-theme` attribute on the body element which you can target in CSS.
 *
 * Safe in SSR: no-op when `document` is not available.
 *
 * @param {ResolvedTheme} {@link ResolvedTheme} - The theme to apply; expected `"light"` or `"dark"`.
 * @returns {void} void
 */
export const applyTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
};

/**
 * Read the stored theme from localStorage.
 *
 * Safe in SSR: returns `null` when `window` is not available.
 *
 * @returns {Theme | null} The stored theme value (e.g. `"light"`, `"dark"`, `"system"`) or `null` if not set.
 */
export const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  return (stored as Theme) ?? null;
};

/**
 * Persist a theme to localStorage.
 *
 * @param {Theme} {@link Theme} - The theme to store (e.g. `"light"`, `"dark"`, `"system"`).
 * @returns {void}
 */
export const setStoredTheme = (theme: Theme): void => {
  if (!localStorage) return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * Registers a listener for system color scheme changes when the selected theme is `"system"`.
 *
 * When active, this listens to the `(prefers-color-scheme: dark)` media query and
 * reapplies the resolved system theme (`"light"` or `"dark"`) whenever it changes.
 *
 * @param {Theme} {@link theme} - If this equals `"system"`, a listener will be registered to track OS theme changes.
 * @returns {() => void} Cleanup function that removes the media query listener.
 */
export const systemThemeListner = (theme: Theme) => {
  if (theme !== "system") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => applyTheme(getSystemTheme());

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
};
