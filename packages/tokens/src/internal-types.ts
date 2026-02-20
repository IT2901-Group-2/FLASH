import { ColorRole } from "./types";

type GlobalColorScale =
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
  | "100A"
  | "200A"
  | "300A"
  | "400A";

type GlobalColorKeys =
  | `${Extract<ColorRole, "neutral">}-${Extract<GlobalColorScale, "000">}`
  | `${ColorRole}-${Exclude<GlobalColorScale, "000">}`;

type FontSizeKeys =
  | "size-heading-2xlarge"
  | "size-heading-xlarge"
  | "size-heading-large"
  | "size-heading-medium"
  | "size-heading-small"
  | "size-heading-xsmall"
  | "size-xlarge"
  | "size-large"
  | "size-medium"
  | "size-small";

type FontLineHeightKeys =
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

export type { GlobalColorScale, GlobalColorKeys, FontSizeKeys, FontLineHeightKeys };
