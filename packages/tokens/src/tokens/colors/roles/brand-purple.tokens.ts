import { type StyleDictionaryTokenConfig } from "@/tokens.utils";

export const BrandPurpleColorTokenConfig = {
  bg: {
    "brand-purple-soft": {
      value: "{brand-purple.100.value}",
      type: "color",
    },
    "brand-purple-softT": {
      value: "{brand-purple.100T.value}",
      type: "color",
    },
    "brand-purple-moderate": {
      value: "{brand-purple.200.value}",
      type: "color",
    },
    "brand-purple-moderateT": {
      value: "{brand-purple.200T.value}",
      type: "color",
    },
    "brand-purple-moderate-hover": {
      value: "{brand-purple.300.value}",
      type: "color",
    },
    "brand-purple-moderate-hoverT": {
      value: "{brand-purple.300T.value}",
      type: "color",
    },
    "brand-purple-moderate-pressed": {
      value: "{brand-purple.400.value}",
      type: "color",
    },
    "brand-purple-moderate-pressedT": {
      value: "{brand-purple.400T.value}",
      type: "color",
    },
    "brand-purple-strong": {
      value: "{brand-purple.600.value}",
      type: "color",
    },
    "brand-purple-strong-hover": {
      value: "{brand-purple.700.value}",
      type: "color",
    },
    "brand-purple-strong-pressed": {
      value: "{brand-purple.800.value}",
      type: "color",
    },
  },
  text: {
    "brand-purple": {
      value: "{brand-purple.1000.value}",
      type: "color",
    },
    "brand-purple-subtle": {
      value: "{brand-purple.800.value}",
      type: "color",
    },
    "brand-purple-decoration": {
      value: "{brand-purple.600.value}",
      type: "color",
    },
    "brand-purple-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    "brand-purple": {
      value: "{brand-purple.600.value}",
      type: "color",
    },
    "brand-purple-subtle": {
      value: "{brand-purple.400.value}",
      type: "color",
    },
    "brand-purple-subtleT": {
      value: "{brand-purple.400T.value}",
      type: "color",
    },
    "brand-purple-strong": {
      value: "{brand-purple.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
