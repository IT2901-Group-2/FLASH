/* --- Color Scale ---*/
export type ColorScale = "base" | "dark" | "light";
export type TextColorScale = ColorScale | "secondary" | "tertiary" | "contrast";

/* --- Font Family --- */

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
