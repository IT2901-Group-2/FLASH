import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const NeutralColorTokenConfig = {
  color: {
    "neutral-base": {
      value: "{neutral.base.value}",
      type: "color",
    },
    "neutral-dark": {
      value: "{neutral.dark.value}",
      type: "color",
    },
    "neutral-light": {
      value: "{neutral.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
