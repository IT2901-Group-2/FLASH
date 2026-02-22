import { type StyleDictionaryTokenConfig } from "@/tokens.utils";

export const AccentColorTokenConfig = {
  bg: {
    "accent-soft": {
      value: "{accent.100.value}",
      type: "color",
    },
    "accent-softA": {
      value: "{accent.100T.value}",
      type: "color",
    },
    "accent-moderate": {
      value: "{accent.200.value}",
      type: "color",
    },
    "accent-moderateA": {
      value: "{accent.200T.value}",
      type: "color",
    },
    "accent-moderate-hover": {
      value: "{accent.300.value}",
      type: "color",
    },
    "accent-moderate-hoverA": {
      value: "{accent.300T.value}",
      type: "color",
    },
    "accent-moderate-pressed": {
      value: "{accent.400.value}",
      type: "color",
    },
    "accent-moderate-pressedA": {
      value: "{accent.400T.value}",
      type: "color",
    },
    "accent-strong": {
      value: "{accent.600.value}",
      type: "color",
    },
    "accent-strong-hover": {
      value: "{accent.700.value}",
      type: "color",
    },
    "accent-strong-pressed": {
      value: "{accent.800.value}",
      type: "color",
    },
  },
  text: {
    accent: {
      value: "{accent.1000.value}",
      type: "color",
    },
    "accent-subtle": {
      value: "{accent.800.value}",
      type: "color",
    },
    "accent-decoration": {
      value: "{accent.600.value}",
      type: "color",
    },
    "accent-contrast": {
      value: "{neutral.000.value}",
      type: "color",
    },
  },
  border: {
    accent: {
      value: "{accent.600.value}",
      type: "color",
    },
    "accent-subtle": {
      value: "{accent.400.value}",
      type: "color",
    },
    "accent-subtleA": {
      value: "{accent.400T.value}",
      type: "color",
    },
    "accent-strong": {
      value: "{accent.700.value}",
      type: "color",
    },
  },
} satisfies StyleDictionaryTokenConfig<"color">;
