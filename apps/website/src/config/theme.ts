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
