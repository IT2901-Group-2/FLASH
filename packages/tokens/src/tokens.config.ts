import { mergeConfigs } from "./tokens.utils";
import { breakpointTokenConfig } from "./tokens/breakpoints";
import { DarkTokens, LightTokens } from "./tokens/colors/color.tokens";
import { dataColorTokensConfig } from "./tokens/colors/data-color.tokens";
import { semanticRootTokens } from "./tokens/colors/root.tokens";
import {
  ColorTokenRoleConfig,
  ColorTokensForAllRoles,
} from "./tokens/colors/semantic.tokens";
import { fontTokenConfig } from "./tokens/font";
import { opacityTokenConfig } from "./tokens/opacity";
import { radiusTokenConfig } from "./tokens/radius";
import { shadowTokenConfig } from "./tokens/shadow";
import { ColorRole } from "./types/output.types";

/**
 * All light mode tokens, optionally including semantic role tokens.
 * @param withSemanticRoles - Whether to include semantic role tokens. Defaults to true.
 * @returns A merged token config object for light mode tokens.
 */
export const lightModeTokens = (withSemanticRoles = true) => {
  const config = [
    shadowTokenConfig("light"),
    opacityTokenConfig("light"),
    withSemanticRoles ? ColorTokensForAllRoles() : {},
    semanticRootTokens("light"),
    LightTokens,
  ];
  return mergeConfigs(config);
};

/**
 * All dark mode tokens, optionally including semantic role tokens.
 * @param withSemanticRoles - Whether to include semantic role tokens. Defaults to true.
 * @returns A merged token config object for dark mode tokens.
 */
export const darkModeTokens = (withSemanticRoles = true) => {
  const config = [
    shadowTokenConfig("dark"),
    opacityTokenConfig("dark"),
    withSemanticRoles ? ColorTokensForAllRoles() : {},
    semanticRootTokens("dark"),
    DarkTokens,
  ];
  return mergeConfigs(config);
};

/**
 * Generates a merged token config for semantic role tokens.
 * @returns A merged token config object for semantic role tokens.
 */
export const roleTokens = () => {
  const config = [LightTokens, ColorTokensForAllRoles()];
  return mergeConfigs(config);
};

/**
 * Generates a merged token config for scale tokens
 *
 * Includes radius and breakpoint tokens.
 * @returns A merged token config object for scale tokens.
 */
export const scaleTokens = () => {
  const config = [radiusTokenConfig, breakpointTokenConfig];
  return mergeConfigs(config);
};

/**
 * Generates a merged token config for root tokens
 *
 * Including scale tokens and font tokens.
 * @returns A merged token config object for root tokens.
 */
export const rootTokens = () => {
  const config = [scaleTokens(), fontTokenConfig, breakpointTokenConfig];
  return mergeConfigs(config);
};

/**
 * Generates a merged token config for all tokens, including light mode tokens, scale tokens, breakpoint tokens, and font tokens.
 * @returns A merged token config object for all tokens.
 */
export const allTokens = () => {
  const config = [
    lightModeTokens(),
    scaleTokens(),
    breakpointTokenConfig,
    fontTokenConfig,
  ];

  return mergeConfigs(config);
};

/**
 * Generates a merged token config for data color tokens based on the provided color role.
 * @param color - The color role for which to generate the data color tokens.
 * @returns A merged token config object for data color tokens corresponding to the specified color role.
 */
export const dataColorTokens = (color: ColorRole) => {
  const config = [LightTokens, ColorTokenRoleConfig[color], dataColorTokensConfig(color)];

  return mergeConfigs(config);
};
