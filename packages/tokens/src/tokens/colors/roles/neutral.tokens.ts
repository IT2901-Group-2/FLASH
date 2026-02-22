import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const NeutralColorTokenConfig = {
  bg: {
    "neutral-soft": {
      value: "{neutral.100.value}",
      type: "color",
    },
    "neutral-softA": {
      value: "{neutral.100T.value}",
      type: "color",
    },
    "neutral-moderate": {
      value: "{neutral.200.value}",
      type: "color",
    },
    "neutral-moderateT": {
      value: "{neutral.200T.value}",
      type: "color",
    },
    "neutral-moderate-hover": {
      value: "{neutral.300.value}",
      type: "color",
    },
    "neutral-moderate-hoverT": {
      value: "{neutral.300T.value}",
      type: "color",
    },
    "neutral-moderate-pressed": {
      value: "{neutral.400.value}",
      type: "color",
    },
    "neutral-moderate-pressedT": {
      value: "{neutral.400T.value}",
      type: "color",
    },
    "neutral-strong": {
      value: "{neutral.700.value}",
      type: "color",
    },
    "neutral-strong-hover": {
      value: "{neutral.800.value}",
      type: "color",
    },
    "neutral-strong-pressed": {
      value: "{neutral.900.value}",
      type: "color",
    },
  },
  text: {
    neutral: {
      value: "{neutral.1000.value}",
      type: "color",
    },
    "neutral-subtle": {
      value: "{neutral.900.value}",
      type: "color",
    },
    "neutral-decoration": {
      value: "{neutral.600.value}",
      type: "color",
    },
    "neutral-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    neutral: {
      value: "{neutral.600.value}",
      type: "color",
    },
    "neutral-subtle": {
      value: "{neutral.400.value}",
      type: "color",
    },
    "neutral-subtleA": {
      value: "{neutral.400T.value}",
      type: "color",
    },
    "neutral-strong": {
      value: "{neutral.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
