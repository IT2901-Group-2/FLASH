import type { ColorTheme, ShadowToken } from "@/types/output.types";
import type { StyleDictionaryToken } from "@/tokens.utils";

export function shadowTokenConfig(theme: ColorTheme) {
  return {
    shadow: {
      dialog: {
        value:
          theme === "light"
            ? `0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25)`
            : `0 0.25rem 0.25rem 0 rgba(255, 255, 255, 0.08)`,
        type: "shadow",
      },
    },
  } satisfies {
    shadow: Record<ShadowToken, StyleDictionaryToken<"shadow">>;
  };
}
