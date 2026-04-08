import { ColorTheme } from "@flash/tokens/types";

/**
 * This file contains constants and type guards related to theme preferences and resolved themes.
 * It defines the valid theme options, cookie keys for storing theme preferences, and utility functions for validating theme values.
 */

export const THEME_PREF_COOKIE_KEY = "theme-preference";
export const THEME_RESOLVED_COOKIE_KEY = "theme-resolved";
export const THEME_COOKIE_DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ResolvedTheme = ColorTheme;
export type Theme = "system" | ResolvedTheme;

const VALID_THEMES: ReadonlySet<Theme> = new Set(["light", "dark", "system"]);
const VALID_RESOLVED_THEMES: ReadonlySet<ResolvedTheme> = new Set(["light", "dark"]);

/**
 * Type guard for theme preference values.
 * @param value - The stored theme preference.
 * @returns Whether the value is a valid theme preference.
 */
export const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && VALID_THEMES.has(value as Theme);
};

/**
 * Type guard for resolved theme values.
 * @param value - The stored resolved theme.
 * @returns Whether the value is a valid resolved theme.
 * Note: Resolved themes should only be "light" or "dark", never "system".
 */
export const isResolvedTheme = (value: unknown): value is ResolvedTheme => {
  return typeof value === "string" && VALID_RESOLVED_THEMES.has(value as ResolvedTheme);
};
