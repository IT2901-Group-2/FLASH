import { ColorRole } from "./output.types";

type ColorScale =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "1000"
  | "000"
  | "100T"
  | "200T"
  | "300T"
  | "400T";

type GlobalColorKeys =
  | `${Extract<ColorRole, "neutral">}-${Extract<ColorScale, "000">}`
  | `${ColorRole}-${Exclude<ColorScale, "000">}`;

export type { ColorScale, GlobalColorKeys };

/*------------------------ Font Family ---------------------- */

export type FontFamilyKeys = "family";

export type FontSizeKeys =
  | "size-heading-2xlarge"
  | "size-heading-xlarge"
  | "size-heading-large"
  | "size-heading-medium"
  | "size-heading-small"
  | "size-heading-xsmall"
  | "size-xlarge"
  | "size-large"
  | "size-medium"
  | "size-small"
  | "size-xsmall";

export type FontLineHeightKeys =
  | "line-height-heading-2xlarge"
  | "line-height-heading-xlarge"
  | "line-height-heading-large"
  | "line-height-heading-medium"
  | "line-height-heading-small"
  | "line-height-heading-xsmall"
  | "line-height-xlarge"
  | "line-height-large"
  | "line-height-medium";

export type FontWeightKeys = "weight-bold" | "weight-regular";
