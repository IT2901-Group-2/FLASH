import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const DangerColorTokenConfig = {
  color: {
    "danger-base": {
      value: "{danger.base.value}",
      type: "color",
    },
    "danger-dark": {
      value: "{danger.dark.value}",
      type: "color",
    },
    "danger-light": {
      value: "{danger.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
