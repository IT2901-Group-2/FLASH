import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { ColorRole } from "@/types/output.types";

export const dataColorTokensConfig = (color: ColorRole) => {
  return {
    bg: {
      soft: {
        value: `{bg.${color}-soft.value}`,
        type: "data-color",
      },
      softT: {
        value: `{bg.${color}-softT.value}`,
        type: "data-color",
      },
      moderate: {
        value: `{bg.${color}-moderate.value}`,
        type: "data-color",
      },
      moderateT: {
        value: `{bg.${color}-moderateT.value}`,
        type: "data-color",
      },
      "moderate-hover": {
        value: `{bg.${color}-moderate-hover.value}`,
        type: "data-color",
      },
      "moderate-hoverT": {
        value: `{bg.${color}-moderate-hoverT.value}`,
        type: "data-color",
      },
      "moderate-pressed": {
        value: `{bg.${color}-moderate-pressed.value}`,
        type: "data-color",
      },
      "moderate-pressedT": {
        value: `{bg.${color}-moderate-pressedT.value}`,
        type: "data-color",
      },
      strong: {
        value: `{bg.${color}-strong.value}`,
        type: "data-color",
      },
      "strong-hover": {
        value: `{bg.${color}-strong-hover.value}`,
        type: "data-color",
      },
      "strong-pressed": {
        value: `{bg.${color}-strong-pressed.value}`,
        type: "data-color",
      },
    },
    text: {
      default: {
        value: `{text.${color}.value}`,
        type: "data-color",
      },
      subtle: {
        value: `{text.${color}-subtle.value}`,
        type: "data-color",
      },
      decoration: {
        value: `{text.${color}-decoration.value}`,
        type: "data-color",
      },
      contrast: {
        value: `{text.${color}-contrast.value}`,
        type: "data-color",
      },
    },
    border: {
      default: {
        value: `{border.${color}.value}`,
        type: "data-color",
      },
      subtle: {
        value: `{border.${color}-subtle.value}`,
        type: "data-color",
      },
      subtleT: {
        value: `{border.${color}-subtleT.value}`,
        type: "data-color",
      },
      strong: {
        value: `{border.${color}-strong.value}`,
        type: "data-color",
      },
    },
  } satisfies StyleDictionaryTokenConfig<"data-color">;
};
