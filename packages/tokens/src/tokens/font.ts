import {
  FontFamilyKeys,
  FontLineHeightKeys,
  FontSizeKeys,
  FontWeightKeys,
} from "@/types/internal.types";
import { StyleDictionaryToken } from "@/tokens.utils";
import { pxToRem } from "@/utils/pxToRem";

export const fontTokenConfig = {
  font: {
    family: {
      value: "'Kantumruy Pro', sans-serif",
      type: "global-font",
    },

    "line-height-heading-2xlarge": {
      value: pxToRem(52),
      type: "global-font",
    },
    "line-height-heading-xlarge": {
      value: pxToRem(40),
      type: "global-font",
    },
    "line-height-heading-large": {
      value: pxToRem(36),
      type: "global-font",
    },
    "line-height-heading-medium": {
      value: pxToRem(32),
      type: "global-font",
    },
    "line-height-heading-small": {
      value: pxToRem(28),
      type: "global-font",
    },
    "line-height-heading-xsmall": {
      value: pxToRem(24),
      type: "global-font",
    },
    "line-height-xlarge": {
      value: pxToRem(28),
      type: "global-font",
    },
    "line-height-large": {
      value: pxToRem(24),
      type: "global-font",
    },
    "line-height-medium": {
      value: pxToRem(20),
      type: "global-font",
    },

    "size-heading-2xlarge": {
      value: pxToRem(48),
      type: "global-font",
    },
    "size-heading-xlarge": {
      value: pxToRem(40),
      type: "global-font",
    },
    "size-heading-large": {
      value: pxToRem(36),
      type: "global-font",
    },
    "size-heading-medium": {
      value: pxToRem(32),
      type: "global-font",
    },
    "size-heading-small": {
      value: pxToRem(24),
      type: "global-font",
    },
    "size-heading-xsmall": {
      value: pxToRem(20),
      type: "global-font",
    },

    "size-xlarge": {
      value: pxToRem(24),
      type: "global-font",
    },
    "size-large": {
      value: pxToRem(20),
      type: "global-font",
    },
    "size-medium": {
      value: pxToRem(16),
      type: "global-font",
    },
    "size-small": {
      value: pxToRem(14),
      type: "global-font",
    },
    "size-xsmall": {
      value: pxToRem(12),
      type: "global-font",
    },

    "weight-bold": {
      value: "700",
      type: "global-font",
    },
    "weight-regular": {
      value: "400",
      type: "global-font",
    },
  },
} satisfies {
  font: Record<
    FontFamilyKeys | FontSizeKeys | FontLineHeightKeys | FontWeightKeys,
    StyleDictionaryToken<"global-font">
  >;
};
