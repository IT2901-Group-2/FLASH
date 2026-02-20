/* --------------------------------- Themes --------------------------------- */
type ColorTheme = "light" | "dark";

/* ------------------------------ Main colors ----------------------------- */
type MainColorRole = "neutral";
// | "accent";

/* ------------------------------ Status colors ----------------------------- */
type StatusColorRole = "success" | "warning" | "danger";

/* ------------------------------ Brand colors ------------------------------ */
type BrandColorRole = "brand-purple";

/* ------------------------------- All colors ------------------------------- */
type ColorRole = MainColorRole;
// | StatusColorRole
// | BrandColorRole;

export type { ColorTheme, ColorRole, MainColorRole, StatusColorRole, BrandColorRole };

/* --------------------------- Backgrounds tokens --------------------------- */

type RootBackgroundToken = "default" | "input" | "raised" | "sunken" | "overlay";

type StatelessBackgroundToken = "soft" | "softT" | "moderate" | "moderateT" | "strong";

type StatefulBackgroundToken =
  | "moderate-hover"
  | "moderate-hoverT"
  | "moderate-pressed"
  | "moderate-pressedT"
  | "strong-hover"
  | "strong-pressed";

type ColoredStatelessBackgroundToken = `${ColorRole}-${StatelessBackgroundToken}`;

type ColoredStatefulBackgroundToken = `${ColorRole}-${StatefulBackgroundToken}`;

/* ------------------------------ Breakpoints tokens ------------------------ */
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

/* ------------------------------ Shadow tokens ----------------------------- */
export type ShadowToken = "dialog";

/* ------------------------------ Border Radius tokens --------------------- */
export type BorderRadiusToken = "2" | "4" | "8" | "12" | "16" | "full";
