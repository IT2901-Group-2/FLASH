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
      "logo-primary": {
        value: theme == "light" ? "#D6AD5B" : "#D6AD5B",
        type: "color",
      },
      "logo-secondary": {
        value: theme == "light" ? "#E5D295" : "#F3EACE",
        type: "color",
      },
    },
    bg: {
      default: {
        value: theme === "light" ? "#f8f2f5" : "#0d0d11",
        type: "color",
      },
      input: {
        value: theme === "light" ? "#fffbfe" : "#29252b",
        type: "color",
      },
      raised: {
        value: theme === "light" ? "#f0e9ec" : "#1c181d",
        type: "color",
      },
      sunken: {
        value: theme === "light" ? "#e2dadd" : "#000",
        type: "color",
      },
      overlay: {
        value: "rgba(12, 22, 39, 0.66)",
        type: "color",
      },
    },
    border: {
      focus: {
        value: theme === "light" ? "{neutral.1000.value}" : "#272529",
        type: "color",
      },
    },
  } satisfies {
    bg: Record<RootBackgroundToken, StyleDictionaryToken<"color">>;
    border: Record<RootBorderToken, StyleDictionaryToken<"color">>;
    text: Record<RootTextToken, StyleDictionaryToken<"color">>;
  };
}
