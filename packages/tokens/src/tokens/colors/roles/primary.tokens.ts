import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const PrimaryColorTokenConfig = {
  color: {
    "primary-base": {
      value: "{primary.base.value}",
      type: "color",
    },
    "primary-dark": {
      value: "{primary.dark.value}",
      type: "color",
    },
    "primary-light": {
      value: "{primary.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
