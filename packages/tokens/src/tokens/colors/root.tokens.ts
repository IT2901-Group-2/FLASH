import { StyleDictionaryToken } from "@/tokens.utils";
import { ColorScale, TextColorScale } from "@/types/internal.types";
import { ColorTheme } from "@/types/output.types";

/**
 * Static root-layer for semantic tokens.
 * These tokens are the  "root"-layer in the sense that they are the only "unique" tokens in the semantic layer.
 */
export function semanticRootTokens(theme: ColorTheme) {
  return {
    "color-background": {
      base: { value: theme == "light" ? "#F8F2F5" : "#0D0D11", type: "color" },
      dark: { value: theme == "light" ? "#F0EAED" : "#09090C", type: "color" },
      light: { value: theme == "light" ? "#F9F5F7" : "#111115", type: "color" },
    },
    "color-logo": {
      primary: { value: theme == "light" ? "#D6AD5B" : "#D6AD5B", type: "color" },
      secondary: { value: theme == "light" ? "#E5D295" : "#F3EACE", type: "color" },
    },
    "color-border": {
      base: { value: theme == "light" ? "#C9BDC0" : "#272529", type: "color" },
      dark: { value: theme == "light" ? "#797173" : "#1B1A1D", type: "color" },
      light: { value: theme == "light" ? "#D9D1D3" : "#3D3B3E", type: "color" },
    },
    "color-text": {
      base: { value: "{neutral.base.value}", type: "color" },
      dark: { value: "{neutral.dark.value}", type: "color" },
      light: { value: "{neutral.light.value}", type: "color" },
      secondary: { value: theme == "light" ? "#828284" : "#8F8F90", type: "color" },
      tertiary: { value: theme == "light" ? "#474747" : "#C7C7C8", type: "color" },
      contrast: { value: theme == "light" ? "#fff" : "#000", type: "color" },
    },
    "color-backdrop": {
      value: theme == "light" ? "#474747A8" : "#242424A8",
      type: "color",
    },
  } satisfies {
    "color-background": Record<ColorScale, StyleDictionaryToken<"color">>;
    "color-logo": Record<"primary" | "secondary", StyleDictionaryToken<"color">>;
    "color-border": Record<ColorScale, StyleDictionaryToken<"color">>;
    "color-text": Record<TextColorScale, StyleDictionaryToken<"color">>;
    "color-backdrop": StyleDictionaryToken<"color">;
  };
}
