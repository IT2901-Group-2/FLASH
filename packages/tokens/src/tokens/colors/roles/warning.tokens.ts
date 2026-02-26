import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const WarningColorTokenConfig = {
  bg: {
    "warning-soft": {
      value: "{warning.100.value}",
      type: "color",
    },
    "warning-softT": {
      value: "{warning.100T.value}",
      type: "color",
    },
    "warning-moderate": {
      value: "{warning.200.value}",
      type: "color",
    },
    "warning-moderateT": {
      value: "{warning.200T.value}",
      type: "color",
    },
    "warning-moderate-hover": {
      value: "{warning.300.value}",
      type: "color",
    },
    "warning-moderate-hoverT": {
      value: "{warning.300T.value}",
      type: "color",
    },
    "warning-moderate-pressed": {
      value: "{warning.400.value}",
      type: "color",
    },
    "warning-moderate-pressedT": {
      value: "{warning.400T.value}",
      type: "color",
    },
    "warning-strong": {
      value: "{warning.600.value}",
      type: "color",
    },
    "warning-strong-hover": {
      value: "{warning.700.value}",
      type: "color",
    },
    "warning-strong-pressed": {
      value: "{warning.800.value}",
      type: "color",
    },
  },
  text: {
    warning: {
      value: "{warning.1000.value}",
      type: "color",
    },
    "warning-subtle": {
      value: "{warning.800.value}",
      type: "color",
    },
    "warning-decoration": {
      value: "{warning.600.value}",
      type: "color",
    },
    "warning-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    warning: {
      value: "{warning.600.value}",
      type: "color",
    },
    "warning-subtle": {
      value: "{warning.400.value}",
      type: "color",
    },
    "warning-subtleT": {
      value: "{warning.400T.value}",
      type: "color",
    },
    "warning-strong": {
      value: "{warning.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
