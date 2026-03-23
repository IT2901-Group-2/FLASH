import { type StyleDictionaryTokenConfig } from "@/tokens.utils";

export const BrandPurpleColorTokenConfig = {
  color: {
    "brand-purple-base": {
      value: "{brand-purple.base.value}",
      type: "color",
    },
    "brand-purple-dark": {
      value: "{brand-purple.dark.value}",
      type: "color",
    },
    "brand-purple-light": {
      value: "{brand-purple.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
