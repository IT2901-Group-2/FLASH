import { StyleDictionaryToken } from "@/tokens.utils";
import {
  ColorTheme,
  RootBackgroundToken,
  RootBorderToken,
  RootTextToken,
} from "@/types/output.types";

/**
 * Static root-layer for semantic tokens.
 * These tokens are the  "root"-layer in the sense that they are the only "unique" tokens in the semantic layer.
 */
export function semanticRootTokens(theme: ColorTheme) {
  return {
    text: {
      logo: {
        value: "#fff",
        type: "color",
      },
    },
    bg: {
      default: {
        value: theme === "light" ? "#f8f2f5" : "#0E151F",
        type: "color",
      },
      input: {
        value: theme === "light" ? "rgba(248, 242, 245, 0.85)" : "rgba(7, 9, 13, 0.50)",
        type: "color",
      },
      raised: {
        value: theme === "light" ? "{neutral.000.value}" : "{neutral.200.value}",
        type: "color",
      },
      sunken: {
        value: theme === "light" ? "{neutral.200.value}" : "#07090D",
        type: "color",
      },
      overlay: {
        value: "rgba(12, 22, 39, 0.66)",
        type: "color",
      },
    },
    border: {
      focus: {
        value: "{neutral.1000.value}",
        type: "color",
      },
    },
  } satisfies {
    bg: Record<RootBackgroundToken, StyleDictionaryToken<"color">>;
    border: Record<RootBorderToken, StyleDictionaryToken<"color">>;
    text: Record<RootTextToken, StyleDictionaryToken<"color">>;
  };
}
