/* --- Themes --- */
type ColorTheme = "light" | "dark";

/* --- Main colors --- */
type MainColorRole = "neutral" | "accent";

/* --- Status colors --- */
type StatusColorRole = "success" | "warning" | "danger";

/* --- Brand colors --- */
type BrandColorRole = "brand-purple";

/* --- All colors --- */
type ColorRole = MainColorRole | StatusColorRole | BrandColorRole;

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

/* --- Text tokens --- */
type LogoColorToken = "logo";
type RootTextToken = `${LogoColorToken}-primary` | `${LogoColorToken}-secondary`;

type ColoredTextToken =
  | ColoredStatefulBackgroundToken
  | `${ColoredStatefulBackgroundToken}-subtle`
  | `${ColoredStatefulBackgroundToken}-decoration`
  | `${ColoredStatefulBackgroundToken}-contrast`;

export type { RootTextToken, ColoredTextToken };

/* --- Border tokens --- */
type RootBorderToken = "focus";

type ColoredBorderToken =
  | ColorRole
  | `${ColorRole}-subtle`
  | `${ColorRole}-subtleT`
  | `${ColorRole}-strong`;

export type { RootBorderToken, ColoredBorderToken };

/* --- Shadow tokens --- */
export type ShadowToken = "dialog";

/* --- Figma surface tokens --- */
export type FigmaSurfaceColor =
  | "background"
  | "primary"
  | "secondary"
  | "accent"
  | "brand"
  | "text"
  | "border"
  | "destructive"
  | "success"
  | "warning";

export type FigmaSurfaceVariant = "base" | "dark" | "light";

export type FigmaTextVariant = FigmaSurfaceVariant | "secondary" | "tertiary";

type NonTextSurfaceToken =
  `color-${Exclude<FigmaSurfaceColor, "text">}-${FigmaSurfaceVariant}`;
type TextSurfaceToken = `color-text-${FigmaTextVariant}`;
export type FigmaSurfaceToken = NonTextSurfaceToken | TextSurfaceToken | "color-backdrop";

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
