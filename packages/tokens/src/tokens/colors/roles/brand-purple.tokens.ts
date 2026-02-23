import { type StyleDictionaryTokenConfig } from "@/tokens.utils";

export const PurpleColorTokenConfig = {
  bg: {
    "purple-soft": {
      value: "{purple.100.value}",
      type: "color",
    },
    "purple-softT": {
      value: "{purple.100T.value}",
      type: "color",
    },
    "purple-moderate": {
      value: "{purple.200.value}",
      type: "color",
    },
    "purple-moderateT": {
      value: "{purple.200T.value}",
      type: "color",
    },
    "purple-moderate-hover": {
      value: "{purple.300.value}",
      type: "color",
    },
    "purple-moderate-hoverT": {
      value: "{purple.300T.value}",
      type: "color",
    },
    "purple-moderate-pressed": {
      value: "{purple.400.value}",
      type: "color",
    },
    "purple-moderate-pressedT": {
      value: "{purple.400T.value}",
      type: "color",
    },
    "purple-strong": {
      value: "{purple.600.value}",
      type: "color",
    },
    "purple-strong-hover": {
      value: "{purple.700.value}",
      type: "color",
    },
    "purple-strong-pressed": {
      value: "{purple.800.value}",
      type: "color",
    },
  },
  text: {
    purple: {
      value: "{purple.1000.value}",
      type: "color",
    },
    "purple-subtle": {
      value: "{purple.800.value}",
      type: "color",
    },
    "purple-decoration": {
      value: "{purple.600.value}",
      type: "color",
    },
    "purple-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    purple: {
      value: "{purple.600.value}",
      type: "color",
    },
    "purple-subtle": {
      value: "{purple.400.value}",
      type: "color",
    },
    "purple-subtleT": {
      value: "{purple.400T.value}",
      type: "color",
    },
    "purple-strong": {
      value: "{purple.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
