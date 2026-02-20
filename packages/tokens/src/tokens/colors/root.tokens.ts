import { StyleDictionaryToken } from "@/tokens.utils";
import { ColorTheme } from "@/types";

/**
 * Static root-layer for semantic tokens.
 * These tokens are the  "root"-layer in the sense that they are the only "unique" tokens in the semantic layer.
 */
export function semanticRootTokens(theme: ColorTheme) {
  return {
    text: {
      logo: {
        value: theme === "light" ? "#C30000" : "{ax.neutral.1000.value}",
        type: "color",
      },
    },
    bg: {
      default: {
        value: theme === "light" ? "#ffffff" : "#0E151F",
        type: "color",
      },
      input: {
        value: theme === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(7, 9, 13, 0.50)",
        type: "color",
      },
      raised: {
        value: theme === "light" ? "{ax.neutral.000.value}" : "{ax.neutral.200.value}",
        type: "color",
      },
      sunken: {
        value: theme === "light" ? "{ax.neutral.200.value}" : "#07090D",
        type: "color",
      },
      overlay: {
        value: "rgba(12, 22, 39, 0.66)",
        type: "color",
      },
    },
    border: {
      focus: {
        value: "{ax.neutral.1000.value}",
        type: "color",
      },
    },
  } satisfies {
    bg: Record<AkselRootBackgroundToken, StyleDictionaryToken<"color">>;
    border: Record<AkselRootBorderToken, StyleDictionaryToken<"color">>;
    text: Record<AkselRootTextToken, StyleDictionaryToken<"color">>;
  };
}
