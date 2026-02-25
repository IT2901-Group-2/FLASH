import { StyleDictionaryTokenConfig } from "@/tokens.utils";

export const DangerColorTokenConfig = {
  bg: {
    "danger-soft": {
      value: "{danger.100.value}",
      type: "color",
    },
    "danger-softT": {
      value: "{danger.100T.value}",
      type: "color",
    },
    "danger-moderate": {
      value: "{danger.200.value}",
      type: "color",
    },
    "danger-moderateT": {
      value: "{danger.200T.value}",
      type: "color",
    },
    "danger-moderate-hover": {
      value: "{danger.300.value}",
      type: "color",
    },
    "danger-moderate-hoverT": {
      value: "{danger.300T.value}",
      type: "color",
    },
    "danger-moderate-pressed": {
      value: "{danger.400.value}",
      type: "color",
    },
    "danger-moderate-pressedT": {
      value: "{danger.400T.value}",
      type: "color",
    },
    "danger-strong": {
      value: "{danger.600.value}",
      type: "color",
    },
    "danger-strong-hover": {
      value: "{danger.700.value}",
      type: "color",
    },
    "danger-strong-pressed": {
      value: "{danger.800.value}",
      type: "color",
    },
  },
  text: {
    danger: {
      value: "{danger.1000.value}",
      type: "color",
    },
    "danger-subtle": {
      value: "{danger.800.value}",
      type: "color",
    },
    "danger-decoration": {
      value: "{danger.600.value}",
      type: "color",
    },
    "danger-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    danger: {
      value: "{danger.600.value}",
      type: "color",
    },
    "danger-subtle": {
      value: "{danger.400.value}",
      type: "color",
    },
    "danger-subtleT": {
      value: "{danger.400T.value}",
      type: "color",
    },
    "danger-strong": {
      value: "{danger.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
