import { ColorTheme } from "@flash/tokens/types";

export const THEME_PREF_COOKIE_KEY = "theme-preference";
export const THEME_RESOLVED_COOKIE_KEY = "theme-resolved";
export const THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ResolvedTheme = ColorTheme;
export type Theme = "system" | ResolvedTheme;

const VALID_THEMES: ReadonlySet<Theme> = new Set(["light", "dark", "system"]);
const VALID_RESOLVED_THEMES: ReadonlySet<ResolvedTheme> = new Set(["light", "dark"]);

export const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && VALID_THEMES.has(value as Theme);
};

export const isResolvedTheme = (value: unknown): value is ResolvedTheme => {
  return typeof value === "string" && VALID_RESOLVED_THEMES.has(value as ResolvedTheme);
};
