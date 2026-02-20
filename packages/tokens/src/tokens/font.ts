import {
  FontFamilyKeys,
  FontLineHeightKeys,
  FontSizeKeys,
  FontWeightKeys,
} from "@/internal-types";
import { StyleDictionaryToken } from "@/tokens.utils";
import { pxToRem } from "@/utils/pxtoRem";

export const fontTokenConfig = {
  font: {
    family: {
      value: "'Kantumruy Pro', sans-serif",
      type: "font",
    },

    "line-height-heading-2xlarge": {
      value: pxToRem(52),
      type: "font",
    },
    "line-height-heading-xlarge": {
      value: pxToRem(40),
      type: "font",
    },
    "line-height-heading-large": {
      value: pxToRem(36),
      type: "font",
    },
    "line-height-heading-medium": {
      value: pxToRem(32),
      type: "font",
    },
    "line-height-heading-small": {
      value: pxToRem(28),
      type: "font",
    },
    "line-height-heading-xsmall": {
      value: pxToRem(24),
      type: "font",
    },
    "line-height-xlarge": {
      value: pxToRem(28),
      type: "font",
    },
    "line-height-large": {
      value: pxToRem(24),
      type: "font",
    },
    "line-height-medium": {
      value: pxToRem(20),
      type: "font",
    },

    "size-heading-2xlarge": {
      value: pxToRem(48),
      type: "font",
    },
    "size-heading-xlarge": {
      value: pxToRem(40),
      type: "font",
    },
    "size-heading-large": {
      value: pxToRem(36),
      type: "font",
    },
    "size-heading-medium": {
      value: pxToRem(32),
      type: "font",
    },
    "size-heading-small": {
      value: pxToRem(24),
      type: "font",
    },
    "size-heading-xsmall": {
      value: pxToRem(20),
      type: "font",
    },

    "size-xlarge": {
      value: pxToRem(24),
      type: "font",
    },
    "size-large": {
      value: pxToRem(20),
      type: "font",
    },
    "size-medium": {
      value: pxToRem(16),
      type: "font",
    },
    "size-small": {
      value: pxToRem(14),
      type: "font",
    },
    "size-xsmall": {
      value: pxToRem(12),
      type: "font",
    },

    "weight-bold": {
      value: "600",
      type: "font",
    },
    "weight-regular": {
      value: "400",
      type: "font",
    },
  },
} satisfies {
  font: Record<
    FontFamilyKeys | FontSizeKeys | FontLineHeightKeys | FontWeightKeys,
    StyleDictionaryToken<"font">
  >;
};
