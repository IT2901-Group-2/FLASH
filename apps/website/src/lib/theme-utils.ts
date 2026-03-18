export const THEME_STORAGE_KEY = "theme";
export const THEME_PREFERENCE_COOKIE_KEY = "theme-preference";
export const THEME_RESOLVED_COOKIE_KEY = "theme-resolved";

export type ResolvedTheme = "light" | "dark";
export type Theme = "system" | ResolvedTheme;

const VALID_THEMES: ReadonlySet<Theme> = new Set(["light", "dark", "system"]);
const VALID_RESOLVED_THEMES: ReadonlySet<ResolvedTheme> = new Set(["light", "dark"]);

const THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && VALID_THEMES.has(value as Theme);
};

export const isResolvedTheme = (value: unknown): value is ResolvedTheme => {
  return typeof value === "string" && VALID_RESOLVED_THEMES.has(value as ResolvedTheme);
};

const setThemeCookie = (
  name: string,
  value: string,
  maxAgeSeconds = THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS
): void => {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure ? "; Secure" : ""}`;
};

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
  if (typeof window.matchMedia !== "function") return "light";
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
 * Read the stored theme from localStorage.
 *
 * Safe in SSR: returns `null` when `window` is not available.
 *
 * @returns {Theme | null} The stored theme value (e.g. `"light"`, `"dark"`, `"system"`) or `null` if not set.
 */
export const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : null;
};

/**
 * Persist a theme to localStorage.
 *
 * @param {Theme} {@link Theme} - The theme to store (e.g. `"light"`, `"dark"`, `"system"`).
 * @returns {void}
 */
export const setStoredTheme = (theme: Theme, resolvedTheme?: ResolvedTheme): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  setThemeCookie(THEME_PREFERENCE_COOKIE_KEY, theme);

  const resolved = resolvedTheme ?? (theme === "system" ? getSystemTheme() : theme);
  setThemeCookie(THEME_RESOLVED_COOKIE_KEY, resolved);
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
 * @returns {() => void} Cleanup function that removes the media query listener.
 */
export const systemThemeListener = (theme: Theme) => {
  if (typeof window === "undefined" || theme !== "system") return () => {};
  if (typeof window.matchMedia !== "function") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = () => {
    const resolved = getSystemTheme();
    applyTheme(resolved);
    setThemeCookie(THEME_RESOLVED_COOKIE_KEY, resolved);
  };

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
};
