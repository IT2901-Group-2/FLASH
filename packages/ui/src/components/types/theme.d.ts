import type { ColorRole } from "@flash/tokens/types";

export type ColorName = ColorRole;

declare global {
  namespace React {
    interface HTMLAttributes {
      "data-color"?: ColorName;
    }
  }
}
