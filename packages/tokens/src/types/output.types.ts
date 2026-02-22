/* --------------------------------- Themes --------------------------------- */
type ColorTheme = "light" | "dark";

/* ------------------------------- Main colors ------------------------------ */
type MainColorRole = "neutral" | "accent";

/* ------------------------------ Status colors ----------------------------- */
type StatusColorRole = "success" | "warning" | "danger";

/* ------------------------------ Brand colors ------------------------------ */
type BrandColorRole = "brand-purple";

/* ------------------------------- All colors ------------------------------- */
type ColorRole = MainColorRole;
// | StatusColorRole
// | BrandColorRole;

export type { ColorTheme, ColorRole, MainColorRole, StatusColorRole, BrandColorRole };

/* --- Backgrounds tokens --- */

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

export type {
  RootBackgroundToken,
  ColoredStatelessBackgroundToken,
  ColoredStatefulBackgroundToken,
  StatelessBackgroundToken,
  StatefulBackgroundToken,
};

/* ------------------------------- Text tokens ------------------------------ */
type RootTextToken = "logo";

type ColoredTextToken =
  | ColoredStatefulBackgroundToken
  | `${ColoredStatefulBackgroundToken}-subtle`
  | `${ColoredStatefulBackgroundToken}-decoration`
  | `${ColoredStatefulBackgroundToken}-contrast`;

export type { RootTextToken, ColoredTextToken };

/* ------------------------------ Border tokens ----------------------------- */
type RootBorderToken = "focus";

type ColoredBorderToken =
  | ColorRole
  | `${ColorRole}-subtle`
  | `${ColorRole}-subtleA`
  | `${ColorRole}-strong`;

export type { RootBorderToken, ColoredBorderToken };

/* ------------------------------ Space tokens ------------------------------ */
export type SpaceToken =
  | "space-0"
  | "space-1"
  | "space-2"
  | "space-4"
  | "space-6"
  | "space-8"
  | "space-12"
  | "space-16"
  | "space-20"
  | "space-24"
  | "space-28"
  | "space-32"
  | "space-36"
  | "space-40"
  | "space-44"
  | "space-48"
  | "space-56"
  | "space-64"
  | "space-72"
  | "space-80"
  | "space-96"
  | "space-128";

/* ------------------------------ Shadow tokens ----------------------------- */
export type ShadowToken = "dialog";

/* ------------------------------ Border Radius tokens --------------------- */
export type BorderRadiusToken = "2" | "4" | "8" | "12" | "16" | "full";

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
