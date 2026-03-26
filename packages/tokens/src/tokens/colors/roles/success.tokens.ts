import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const SuccessColorTokenConfig = {
  color: {
    "success-base": {
      value: "{success.base.value}",
      type: "color",
    },
    "success-dark": {
      value: "{success.dark.value}",
      type: "color",
    },
    "success-light": {
      value: "{success.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
