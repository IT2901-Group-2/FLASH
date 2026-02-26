import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const SuccessColorTokenConfig = {
  bg: {
    "success-soft": {
      value: "{success.100.value}",
      type: "color",
    },
    "success-softT": {
      value: "{success.100T.value}",
      type: "color",
    },
    "success-moderate": {
      value: "{success.200.value}",
      type: "color",
    },
    "success-moderateT": {
      value: "{success.200T.value}",
      type: "color",
    },
    "success-moderate-hover": {
      value: "{success.300.value}",
      type: "color",
    },
    "success-moderate-hoverT": {
      value: "{success.300T.value}",
      type: "color",
    },
    "success-moderate-pressed": {
      value: "{success.400.value}",
      type: "color",
    },
    "success-moderate-pressedT": {
      value: "{success.400T.value}",
      type: "color",
    },
    "success-strong": {
      value: "{success.600.value}",
      type: "color",
    },
    "success-strong-hover": {
      value: "{success.700.value}",
      type: "color",
    },
    "success-strong-pressed": {
      value: "{success.800.value}",
      type: "color",
    },
  },
  text: {
    success: {
      value: "{success.1000.value}",
      type: "color",
    },
    "success-subtle": {
      value: "{success.800.value}",
      type: "color",
    },
    "success-decoration": {
      value: "{success.600.value}",
      type: "color",
    },
    "success-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    success: {
      value: "{success.600.value}",
      type: "color",
    },
    "success-subtle": {
      value: "{success.400.value}",
      type: "color",
    },
    "success-subtleT": {
      value: "{success.400T.value}",
      type: "color",
    },
    "success-strong": {
      value: "{success.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
