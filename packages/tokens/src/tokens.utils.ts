import type { ColorRole } from "./types";
import { merge } from "./utils/merge";

export type GlobalColorEntry = {
  value: string;
  type: "global-color";
  group: ColorRole;
};

export type TokenTypes =
  | "color"
  | "global-color"
  | "shadow"
  | "opacity"
  | "radius"
  | "space"
  | "breakpoint"
  | "font";

export type SemanticTokenGroups = "background" | "border" | "text";

export type FontGroups =
  | "family"
  | "line-height"
  | "line-height-heading"
  | "size"
  | "size-heading"
  | "weight";

export type BreakpointGroups = "mobile first" | "desktop first";

export type TokenGroup =
  | ColorRole
  | SemanticTokenGroups
  | `${SemanticTokenGroups}.${ColorRole}`
  | FontGroups
  | BreakpointGroups;

export type StyleDictionaryToken<T extends TokenTypes> = {
  /**
   * Token value
   * @example "#000000"
   * @example "1px"
   * @example "{a.neutral.100.value}"
   */
  value: string;
  /**
   * Token type
   */
  type: T;
};

export type StyleDictionaryTokenConfig<T extends TokenTypes> = {
  [key: string]: Record<string, StyleDictionaryToken<T>>;
};

export const mergeConfigs = (
  configs: StyleDictionaryTokenConfig<TokenTypes>[]
): StyleDictionaryTokenConfig<TokenTypes> => {
  return configs.reduce((acc, config) => merge(acc, config), {});
};
