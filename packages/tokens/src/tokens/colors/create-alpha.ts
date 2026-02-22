import Color, { type Coords } from "colorjs.io";
import { ColorRole, ColorTheme } from "@/types/output.types";
import { ColorConfigWithAlpha, ColorConfigWithoutAlpha } from "@/types/color.types";
import { semanticRootTokens } from "./roles/root.tokens";

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

function parseAndValidateCoords(coords: Coords): number[] {
  return coords.map(coord => {
    if (coord === null) throw new Error(`Color coordinate is undefined: ${coord}`);
    return coord;
  });
}

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

  // Is the background color lighter, RGB-wise, than target color?
  // Decide whether we want to add as little color or as much color as possible,
  // darkening or lightening the background respectively.
  // If at least one of the bits of the target RGB value
  // is lighter than the background, we want to lighten it.
  const desiredRgb = tr > br || tg > bg || tb > bb ? rgbPrecision : 0;

  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  const isPureGray = [alphaR, alphaG, alphaB].every(alpha => alpha === alphaR);

  // No need for precision gymnastics with pure grays, and we can get cleaner output
  if (!targetAlpha && isPureGray) {
    // Convert back to 0-1 values
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

const blendAlpha = (
  foreground: number,
  alpha: number,
  background: number,
  round = true
): number => {
  if (round) return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
  return background * (1 - alpha) + foreground * alpha;
};

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
