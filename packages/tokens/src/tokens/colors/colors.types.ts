import { ColorScale } from "@/internal-types";
import { ColorEntry } from "@/tokens.utils";
import { ColorRole } from "@/types";

export type ColorConfigWithAlpha = Record<
  Extract<ColorRole, "neutral">,
  Record<ColorScale, ColorEntry>
> &
  Record<Exclude<ColorRole, "neutral">, Record<Exclude<ColorScale, "000">, ColorEntry>>;

export type ColorConfigWithoutAlpha = Record<
  ColorRole,
  Record<Exclude<ColorScale, "000" | "100A" | "200A" | "300A" | "400A">, ColorEntry>
> & {
  neutral: {
    [key in Extract<ColorScale, "000">]: ColorEntry;
  };
};
