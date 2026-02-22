import { StyleDictionaryToken } from "@/tokens.utils";
import { ColorTheme } from "@/types/output.types";

export function opacityTokenConfig(theme: ColorTheme) {
  return {
    opacity: {
      disabled: {
        value: theme === "light" ? `0.3` : `0.4`,
        type: "opacity",
      },
    },
  } satisfies {
    opacity: Record<"disabled", StyleDictionaryToken<"opacity">>;
  };
}
