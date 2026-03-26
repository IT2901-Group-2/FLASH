import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const WarningColorTokenConfig = {
  color: {
    "warning-base": {
      value: "{warning.base.value}",
      type: "color",
    },
    "warning-dark": {
      value: "{warning.dark.value}",
      type: "color",
    },
    "warning-light": {
      value: "{warning.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
