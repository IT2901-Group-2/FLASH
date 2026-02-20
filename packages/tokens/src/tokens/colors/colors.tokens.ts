import { ColorConfigWithoutAlpha } from "./colors.types";
import { globalConfigWithAlphaTokens } from "./create-alpha";

const LightTokensNoAlpha: ColorConfigWithoutAlpha = {
  neutral: {
    "000": { value: "#ffffff", type: "color" },
    "100": { value: "#d3d6db", type: "color" },
    "200": { value: "#b6bbc4", type: "color" },
    "300": { value: "#9ea5b1", type: "color" },
    "400": { value: "#9097a5", type: "color" },
    "500": { value: "#8a92a0", type: "color" },
    "600": { value: "#757c88", type: "color" },
    "700": { value: "#616670", type: "color" },
    "800": { value: "#4c5058", type: "color" },
    "900": { value: "#373a40", type: "color" },
    "1000": { value: "#222428", type: "color" },
  },
  // accent: {
  //   "100": { value: "#eadcd5", type: "color" },
  //   "200": { value: "#dcc4b9", type: "color" },
  //   "300": { value: "#d1b1a3", type: "color" },
  //   "400": { value: "#caa695", type: "color" },
  //   "500": { value: "#c7a18f", type: "color" },
  //   "600": { value: "#a9897a", type: "color" },
  //   "700": { value: "#8b7164", type: "color" },
  //   "800": { value: "#6d594f", type: "color" },
  //   "900": { value: "#504039", type: "color" },
  //   "1000": { value: "#322824", type: "color" },
  // },
} as const;
const DarkTokensNoAlpha: ColorConfigWithoutAlpha = {
  neutral: {
    "000": { value: "#000000", type: "color" },
    "100": { value: "#222428", type: "color" },
    "200": { value: "#373a40", type: "color" },
    "300": { value: "#4c5058", type: "color" },
    "400": { value: "#616670", type: "color" },
    "500": { value: "#757c88", type: "color" },
    "600": { value: "#8a92a0", type: "color" },
    "700": { value: "#9097a5", type: "color" },
    "800": { value: "#9ea5b1", type: "color" },
    "900": { value: "#b6bbc4", type: "color" },
    "1000": { value: "#d3d6db", type: "color" },
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
