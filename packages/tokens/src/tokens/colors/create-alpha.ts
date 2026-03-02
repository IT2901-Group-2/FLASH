import Color, { type Coords } from "colorjs.io";
import { ColorRole, ColorTheme } from "@/types/output.types";
import { ColorConfigWithAlpha, ColorConfigWithoutAlpha } from "@/types/color.types";
import { semanticRootTokens } from "./root.tokens";

const ALPHA_LEVELS = ["100", "200", "300", "400"] as const;

export function globalConfigWithAlphaTokens({
  config: globalConfig,
  theme,
}: {
  config: ColorConfigWithoutAlpha;
  theme: ColorTheme;
}): ColorConfigWithAlpha {
  const localConfig = structuredClone(globalConfig) as ColorConfigWithAlpha;

  Object.keys(globalConfig).forEach(key => {
    const scopedConfig = localConfig[key as ColorRole];
    ALPHA_LEVELS.forEach(level => {
      scopedConfig[`${level}T`] = {
        ...scopedConfig[level],
        value: createAlphaColor(scopedConfig[level].value, theme),
      };
    });
  });

  return localConfig;
}

/**
 * Creates an alpha color based on the target color and the background color
 * defined in the theme. The function calculates the appropriate alpha value
 * to achieve the desired color blending effect, ensuring that the resulting
 * color maintains visual consistency with the background.
 *
 * @param targetColor - The target color for which the alpha version is to be created.
 * @param theme - The color theme to determine the background color from.
 * @returns A string representing the alpha color in hex format.
 */
const createAlphaColor = (targetColor: string, theme: ColorTheme): string => {
  const backgroundColor = semanticRootTokens(theme).bg.default.value;

  const targetCoords = new Color(targetColor).to("srgb").coords;
  const backgroundCoords = new Color(backgroundColor).to("srgb").coords;

  const [r, g, b, a] = getAlphaColor(
    parseAndValidateCoords(targetCoords),
    parseAndValidateCoords(backgroundCoords),
    255,
    255
  );

  return formatHex(new Color("srgb", [r, g, b], a).toString({ format: "hex" }));
};

/**
 * Parses and validates color coordinates, ensuring that none of the coordinates are undefined.
 * @param coords - An array of color coordinates (e.g., RGB values).
 * @returns An array of validated color coordinates.
 * @throws Will throw an error if any of the color coordinates are undefined.
 * @example
 * parseAndValidateCoords([255, 0, 0]) // returns [255, 0, 0]
 * parseAndValidateCoords([255, undefined, 0]) // throws Error: Color coordinate is undefined: undefined
 */
function parseAndValidateCoords(coords: Coords): number[] {
  return coords.map(coord => {
    if (coord === null) throw new Error(`Color coordinate is undefined: ${coord}`);
    return coord;
  });
}

/**
 * Calculates the alpha color. The function determines the appropriate alpha
 * value to achieve the desired color blending effect while ensuring that the
 * resulting color maintains visual consistency with the background.
 *
 * @param targetRgb - The RGB values of the target color.
 * @param backgroundRgb - The RGB values of the background color.
 * @param rgbPrecision  - The precision for RGB values (e.g., 255 for standard RGB).
 * @param alphaPrecision - The precision for alpha values (e.g., 255 for standard alpha).
 * @param targetAlpha - Optional target alpha value to use instead of calculating it based on the RGB values.
 * @returns An array containing the RGBa values of the resulting color.
 */
function getAlphaColor(
  targetRgb: number[],
  backgroundRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  targetAlpha?: number
): [number, number, number, number] {
  const [tr, tg, tb] = targetRgb.map(c => Math.round(c * rgbPrecision));
  const [br, bg, bb] = backgroundRgb.map(c => Math.round(c * rgbPrecision));

  //? For some reason this does not work with type checking...
  // if ([tr, tg, tb, br, bg, bb].some(c => c === undefined))
  //   throw Error("Color is undefined");

  if (
    tr === undefined ||
    tg === undefined ||
    tb === undefined ||
    br === undefined ||
    bg === undefined ||
    bb === undefined
  )
    throw Error("Color is undefined");

  const desiredRgb = tr > br || tg > bg || tb > bb ? rgbPrecision : 0;

  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  const isPureGray = [alphaR, alphaG, alphaB].every(alpha => alpha === alphaR);

  if (!targetAlpha && isPureGray) {
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR] as const;
  }

  const clampRGB = (n: number) =>
    Number.isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n));
  const clampAlpha = (n: number) =>
    Number.isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n));
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB);

  const A = clampAlpha(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision;
  const correctChannel = (
    target: number,
    background: number,
    channel: number
  ): number => {
    const blended = blendAlpha(channel, A, background);
    return target !== blended ? (target > blended ? channel + 1 : channel - 1) : channel;
  };

  const channels = [
    { t: tr, b: br },
    { t: tg, b: bg },
    { t: tb, b: bb },
  ].map(({ t, b }) => {
    let ch = Math.ceil(clampRGB((t - b * (1 - A)) / A));
    const shouldCorrect = desiredRgb === 0 ? t <= b : t >= b;
    if (shouldCorrect) ch = correctChannel(t, b, ch);
    return ch / rgbPrecision;
  });

  return [...channels, A] as [number, number, number, number];
}

/**
 * Blends a foreground color with a background color based on the given alpha value.
 * The resulting color is calculated using the formula:
 * `blended = background * (1 - alpha) + foreground * alpha`
 *
 * @param foreground - The foreground color channel value (0-255).
 * @param alpha - The alpha value (0-1) representing the opacity of the foreground color.
 * @param background - The background color channel value (0-255).
 * @param round - Whether to round the resulting blended color channel value to the nearest integer (default: true).
 * @returns The blended color channel value, either rounded to the nearest integer or as a float depending on the `round` parameter.
 *
 * @example
 * blendAlpha(255, 0.5, 0) // returns 128
 * blendAlpha(255, 0.5, 0, false) // returns 127.5
 * blendAlpha(127, 0.25, 255) // returns 191
 */
const blendAlpha = (
  foreground: number,
  alpha: number,
  background: number,
  round = true
): number => {
  if (round) return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
  return background * (1 - alpha) + foreground * alpha;
};

/**
 * Formats a hex color from a string.
 *
 * If the string is in 3 or 4 character hex format, it converts it to 6 or 8
 * character format respectively. If the string is not a hex color, it
 * returns the original string.
 *
 * @param str The input string to format.
 * @returns A formatted hex color string or the original string if it's not a hex color.
 * @example
 * formatHex("#abc") // returns "#aabbcc"
 * formatHex("#abcd") // returns "#aabbccdd"
 */
const formatHex = (str: string): string => {
  if (!str.startsWith("#")) return str;
  if (str.length !== 4 && str.length !== 5) return str;
  return (
    "#" +
    str
      .slice(1)
      .split("")
      .map(c => c + c)
      .join("")
  );
};
