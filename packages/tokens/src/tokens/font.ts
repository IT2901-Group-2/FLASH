import {
  FontFamilyKeys,
  FontLineHeightKeys,
  FontSizeKeys,
  FontWeightKeys,
} from "@/internal-types";
import { StyleDictionaryToken } from "@/tokens.utils";
import { getFontSize } from "@/utils/getFontSize";

export const fontTokenConfig = {
  font: {
    family: {
      value: "'Kantumruy Pro', sans-serif",
      type: "font",
    },

    "line-height-heading-2xlarge": {
      value: getFontSize(52),
      type: "font",
    },
    "line-height-heading-xlarge": {
      value: getFontSize(40),
      type: "font",
    },
    "line-height-heading-large": {
      value: getFontSize(36),
      type: "font",
    },
    "line-height-heading-medium": {
      value: getFontSize(32),
      type: "font",
    },
    "line-height-heading-small": {
      value: getFontSize(28),
      type: "font",
    },
    "line-height-heading-xsmall": {
      value: getFontSize(24),
      type: "font",
    },
    "line-height-xlarge": {
      value: getFontSize(28),
      type: "font",
    },
    "line-height-large": {
      value: getFontSize(24),
      type: "font",
    },
    "line-height-medium": {
      value: getFontSize(20),
      type: "font",
    },

    "size-heading-2xlarge": {
      value: getFontSize(48),
      type: "font",
    },
    "size-heading-xlarge": {
      value: getFontSize(40),
      type: "font",
    },
    "size-heading-large": {
      value: getFontSize(36),
      type: "font",
    },
    "size-heading-medium": {
      value: getFontSize(32),
      type: "font",
    },
    "size-heading-small": {
      value: getFontSize(24),
      type: "font",
    },
    "size-heading-xsmall": {
      value: getFontSize(20),
      type: "font",
    },

    "size-xlarge": {
      value: getFontSize(24),
      type: "font",
    },
    "size-large": {
      value: getFontSize(20),
      type: "font",
    },
    "size-medium": {
      value: getFontSize(16),
      type: "font",
    },
    "size-small": {
      value: getFontSize(14),
      type: "font",
    },
    "size-xsmall": {
      value: getFontSize(12),
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
