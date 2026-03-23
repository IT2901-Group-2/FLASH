import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const SecondaryColorTokenConfig = {
  color: {
    "secondary-base": {
      value: "{secondary.base.value}",
      type: "color",
    },
    "secondary-dark": {
      value: "{secondary.dark.value}",
      type: "color",
    },
    "secondary-light": {
      value: "{secondary.light.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
