import { merge } from "./utils/merge";

export type ColorEntry = {
  value: string;
  type: "global-color";
};

export type TokenTypes =
  | "color"
  | "global-color"
  | "shadow"
  | "opacity"
  | "global-radius"
  | "global-space"
  | "global-breakpoint"
  | "global-font"
  | "data-color";

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

/**
 * Merges multiple token configuration objects into a single configuration object.
 *
 * @param configs - An array of token configuration objects to merge.
 * @returns A single merged token configuration object.
 */
export const mergeConfigs = (
  configs: StyleDictionaryTokenConfig<TokenTypes>[]
): StyleDictionaryTokenConfig<TokenTypes> => {
  return configs.reduce((acc, config) => merge(acc, config), {});
};
