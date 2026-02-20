import { BreakpointToken } from "@/types";
import { type StyleDictionaryToken } from "../tokens.utils";

export const breakpointTokenConfig = {
  breakpoint: {
    xs: {
      value: "0",
      type: "breakpoint",
    },
    sm: {
      value: "480px",
      type: "breakpoint",
    },
    "sm-down": {
      value: "479px",
      type: "breakpoint",
    },
    md: {
      value: "768px",
      type: "breakpoint",
    },
    "md-down": {
      value: "767px",
      type: "breakpoint",
    },
    lg: {
      value: "1024px",
      type: "breakpoint",
    },
    "lg-down": {
      value: "1023px",
      type: "breakpoint",
    },
    xl: {
      value: "1280px",
      type: "breakpoint",
    },
    "xl-down": {
      value: "1279px",
      type: "breakpoint",
    },
    "2xl": {
      value: "1440px",
      type: "breakpoint",
    },
    "2xl-down": {
      value: "1439px",
      type: "breakpoint",
    },
  },
} satisfies {
  breakpoint: Record<BreakpointToken, StyleDictionaryToken<"breakpoint">>;
};
