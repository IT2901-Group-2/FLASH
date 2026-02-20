import { StyleDictionaryToken } from "@/tokens.utils";
import { BorderRadiusToken } from "@/types";

export const radiusTokenConfig = {
  radius: {
    "2": {
      value: "0.125rem",
      type: "radius",
    },
    "4": {
      value: "0.25rem",
      type: "radius",
    },
    "8": {
      value: "0.5rem",
      type: "radius",
    },
    "12": {
      value: "0.75rem",
      type: "radius",
    },
    "16": {
      value: "1rem",
      type: "radius",
    },
    full: {
      value: "9999px",
      type: "radius",
    },
  },
} satisfies {
  radius: Record<BorderRadiusToken, StyleDictionaryToken<"radius">>;
};
