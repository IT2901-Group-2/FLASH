/* --------------------------------- Themes --------------------------------- */
type ColorTheme = "light" | "dark";

/* ------------------------------ Main colors ----------------------------- */
type MainColorRole = "neutral" | "accent";

/* ------------------------------ Status colors ----------------------------- */
type StatusColorRole = "success" | "warning" | "danger";

/* ------------------------------ Brand colors ------------------------------ */
type BrandColorRole = "brand-purple";

/* ------------------------------- All colors ------------------------------- */
type ColorRole = MainColorRole | StatusColorRole | BrandColorRole;

export type { ColorTheme, ColorRole, MainColorRole, StatusColorRole, BrandColorRole };

/* --------------------------- Backgrounds tokens --------------------------- */

type RootBackgroundToken = "default" | "input" | "raised" | "sunken" | "overlay";

type DynamicStatelessBackgroundToken =
  | "soft"
  | "softA"
  | "moderate"
  | "moderateA"
  | "strong";

type DynamicStatefulBackgroundToken =
  | "moderate-hover"
  | "moderate-hoverA"
  | "moderate-pressed"
  | "moderate-pressedA"
  | "strong-hover"
  | "strong-pressed";

type ColoredStatelessBackgroundToken = `${ColorRole}-${DynamicStatelessBackgroundToken}`;

type ColoredStatefulBackgroundToken = `${ColorRole}-${DynamicStatefulBackgroundToken}`;

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
type ShadowToken = "dialog";

export type { ShadowToken };
