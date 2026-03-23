/* --- Themes --- */
type ColorTheme = "light" | "dark";

/* --- Main colors --- */
type MainColorRole = "primary" | "secondary" | "accent";

/* --- Status colors --- */
type StatusColorRole = "success" | "warning" | "danger";

/* --- Brand colors --- */
type BrandColorRole = "brand-purple";

/* --- All colors --- */
type ColorRole = MainColorRole | StatusColorRole | BrandColorRole;

export type { ColorTheme, ColorRole, MainColorRole, StatusColorRole, BrandColorRole };

/* --- Shadow tokens --- */
export type ShadowToken = "dialog";

/* --- Border Radius tokens ------------- */
export type BorderRadiusToken = "2" | "4" | "8" | "12" | "16" | "full";

/* --- Breakpoints tokens ---------------- */
export type BreakpointToken =
  | "xs"
  | "sm"
  | "sm-down"
  | "md"
  | "md-down"
  | "lg"
  | "lg-down"
  | "xl"
  | "xl-down"
  | "2xl"
  | "2xl-down";
