import { ColorEntry } from "@/tokens.utils";
import { ColorScale } from "@/types/internal.types";
import { ColorRole } from "@/types/output.types";

export type ColorConfig = Record<ColorRole, Record<ColorScale, ColorEntry>>;

export const LightTokens: ColorConfig = {
  neutral: {
    base: { value: "#474747", type: "global-color" },
    dark: { value: "#343448", type: "global-color" }, // This is blue, change this in the future
    light: { value: "#828284", type: "global-color" },
  },
  primary: {
    base: { value: "#F2E7EA", type: "global-color" },
    dark: { value: "#DAD0D3", type: "global-color" },
    light: { value: "#f6eef0", type: "global-color" },
  },
  secondary: {
    base: { value: "#F8EEF1", type: "global-color" },
    dark: { value: "#F2E8EB", type: "global-color" },
    light: { value: "#F9F1F3", type: "global-color" },
  },
  accent: {
    base: { value: "#C7A18F", type: "global-color" },
    dark: { value: "#BD9988", type: "global-color" },
    light: { value: "#CAA695", type: "global-color" },
  },
  success: {
    base: { value: "#3d9751", type: "global-color" },
    dark: { value: "#348045", type: "global-color" },
    light: { value: "#5aa76b", type: "global-color" },
  },
  warning: {
    base: { value: "#F6BA53", type: "global-color" },
    dark: { value: "#d19e47", type: "global-color" },
    light: { value: "#f7c46d", type: "global-color" },
  },
  danger: {
    base: { value: "#e22948", type: "global-color" },
    dark: { value: "#c0233d", type: "global-color" },
    light: { value: "#e64963", type: "global-color" },
  },
  "brand-purple": {
    base: { value: "#774262", type: "global-color" },
    dark: { value: "#6B3B58", type: "global-color" },
    light: { value: "#7a4766", type: "global-color" },
  },
} as const;

export const DarkTokens: ColorConfig = {
  neutral: {
    base: { value: "#c7c7c8", type: "global-color" },
    dark: { value: "#8f8f90", type: "global-color" },
    light: { value: "#f3f2f6", type: "global-color" },
  },
  primary: {
    base: { value: "#1C181D", type: "global-color" },
    dark: { value: "#181419", type: "global-color" },
    light: { value: "#221e23", type: "global-color" },
  },
  secondary: {
    base: { value: "#29252B", type: "global-color" },
    dark: { value: "#19161A", type: "global-color" },
    light: { value: "#1f1b20", type: "global-color" },
  },
  accent: {
    base: { value: "#8A6654", type: "global-color" },
    dark: { value: "#8a6654", type: "global-color" },
    light: { value: "#8d6a58", type: "global-color" },
  },
  success: {
    base: { value: "#3d9751", type: "global-color" },
    dark: { value: "#348045", type: "global-color" },
    light: { value: "#5aa76b", type: "global-color" },
  },
  warning: {
    base: { value: "#F6BA53", type: "global-color" },
    dark: { value: "#d19e47", type: "global-color" },
    light: { value: "#f7c46d", type: "global-color" },
  },
  danger: {
    base: { value: "#e22948", type: "global-color" },
    dark: { value: "#c0233d", type: "global-color" },
    light: { value: "#e64963", type: "global-color" },
  },
  "brand-purple": {
    base: { value: "#60344E", type: "global-color" },
    dark: { value: "#593048", type: "global-color" },
    light: { value: "#643952", type: "global-color" },
  },
} as const;
