import type { ColorRole } from "@flash/tokens/types";

export interface CustomName {}
export type ColorName = ColorRole | keyof CustomName;

declare global {
  namespace React {
    interface HTMLAttributes {
      "data-color"?: ColorName;
    }
  }
}
