import { StyleDictionaryToken } from "@/tokens.utils";
import { BorderRadiusToken } from "@/types";

export const radiusTokenConfig = {
  radius: {
    "2": {
      value: "0.125rem",
      type: "global-radius",
    },
    "4": {
      value: "0.25rem",
      type: "global-radius",
    },
    "8": {
      value: "0.5rem",
      type: "global-radius",
    },
    "12": {
      value: "0.75rem",
      type: "global-radius",
    },
    "16": {
      value: "1rem",
      type: "global-radius",
    },
    full: {
      value: "9999px",
      type: "global-radius",
    },
  },
} satisfies {
  radius: Record<BorderRadiusToken, StyleDictionaryToken<"global-radius">>;
};
