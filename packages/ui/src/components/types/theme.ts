import type { ColorRole } from "@flash/tokens/types";
export type ColorName = ColorRole;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
      "data-color"?: ColorName;
    }
  }
}
