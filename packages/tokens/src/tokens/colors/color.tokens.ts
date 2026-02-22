import { ColorConfigWithoutAlpha } from "@/types/color.types";
import { globalConfigWithAlphaTokens } from "./create-alpha";

const LightTokensNoAlpha: ColorConfigWithoutAlpha = {
  neutral: {
    "000": { value: "white", type: "global-color" },
    "100": { value: "#d3d6db", type: "global-color" },
    "200": { value: "#b6bbc4", type: "global-color" },
    "300": { value: "#9ea5b1", type: "global-color" },
    "400": { value: "#9097a5", type: "global-color" },
    "500": { value: "#8a92a0", type: "global-color" },
    "600": { value: "#757c88", type: "global-color" },
    "700": { value: "#616670", type: "global-color" },
    "800": { value: "#4c5058", type: "global-color" },
    "900": { value: "#373a40", type: "global-color" },
    "1000": { value: "#222428", type: "global-color" },
  },
  accent: {
    "100": { value: "#f5eeeb", type: "global-color" },
    "200": { value: "#eee0da", type: "global-color" },
    "300": { value: "#e1cbc0", type: "global-color" },
    "400": { value: "#c7a18f", type: "global-color" },
    "500": { value: "#b98e7a", type: "global-color" },
    "600": { value: "#a27560", type: "global-color" },
    "700": { value: "#87604e", type: "global-color" },
    "800": { value: "#715243", type: "global-color" },
    "900": { value: "#60483c", type: "global-color" },
    "1000": { value: "#32241d", type: "global-color" },
  },
} as const;

const DarkTokensNoAlpha: ColorConfigWithoutAlpha = {
  neutral: {
    "000": { value: "#000000", type: "global-color" },
    "100": { value: "#222428", type: "global-color" },
    "200": { value: "#373a40", type: "global-color" },
    "300": { value: "#4c5058", type: "global-color" },
    "400": { value: "#616670", type: "global-color" },
    "500": { value: "#757c88", type: "global-color" },
    "600": { value: "#8a92a0", type: "global-color" },
    "700": { value: "#9097a5", type: "global-color" },
    "800": { value: "#9ea5b1", type: "global-color" },
    "900": { value: "#b6bbc4", type: "global-color" },
    "1000": { value: "#d3d6db", type: "global-color" },
  },
  accent: {
    "100": { value: "#32241d", type: "global-color" },
    "200": { value: "#60483c", type: "global-color" },
    "300": { value: "#715243", type: "global-color" },
    "400": { value: "#87604e", type: "global-color" },
    "500": { value: "#a27560", type: "global-color" },
    "600": { value: "#b98e7a", type: "global-color" },
    "700": { value: "#c7a18f", type: "global-color" },
    "800": { value: "#e1cbc0", type: "global-color" },
    "900": { value: "#eee0da", type: "global-color" },
    "1000": { value: "#f5eeeb", type: "global-color" },
  },
} as const;

export const LightTokens = globalConfigWithAlphaTokens({
  config: LightTokensNoAlpha,
  theme: "light",
});

export const DarkTokens = globalConfigWithAlphaTokens({
  config: DarkTokensNoAlpha,
  theme: "dark",
});
