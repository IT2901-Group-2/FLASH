import { type StyleDictionaryTokenConfig } from "@/tokens.utils";

export const AccentColorTokenConfig = {
  color: {
    "accent-base": {
      value: "{accent.base.value}",
      type: "color",
    },
    "accent-dark": {
      value: "{accent.dark.value}",
      type: "color",
    },
    "accent-light": {
      value: "{accent.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
