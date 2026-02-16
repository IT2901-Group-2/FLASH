import { GlobalColorScale } from "@/internal-types";
import { GlobalColorEntry } from "@/tokens.utils";
import { ColorRole } from "@/types";

export type GlobalConfigWithAlpha = Record<
  Extract<ColorRole, "neutral">,
  Record<GlobalColorScale, GlobalColorEntry>
> &
  Record<
    Exclude<ColorRole, "neutral">,
    Record<Exclude<GlobalColorScale, "000">, GlobalColorEntry>
  >;

export type GlobalConfigWithoutAlpha = Record<
  ColorRole,
  Record<
    Exclude<GlobalColorScale, "000" | "100A" | "200A" | "300A" | "400A">,
    GlobalColorEntry
  >
> & {
  neutral: {
    [key in Extract<GlobalColorScale, "000">]: GlobalColorEntry;
  };
};
