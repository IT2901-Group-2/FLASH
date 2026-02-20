import { mergeConfigs } from "./tokens.utils";
import { breakpointTokenConfig } from "./tokens/breakpoints";
import { DarkTokens, LightTokens } from "./tokens/colors/colors.tokens";
import { fontTokenConfig } from "./tokens/font";
import { opacityTokenConfig } from "./tokens/opacity";
import { radiusTokenConfig } from "./tokens/radius";
import { shadowTokenConfig } from "./tokens/shadow";

export const lightModeTokens = (withSemanticRoles = true) => {
  const config = [
    shadowTokenConfig("light"),
    opacityTokenConfig("light"),
    // withSemanticRoles ? semanticTokensForAllRoles() : {},
    // semanticRootTokens("light"),
    LightTokens,
  ];

  return mergeConfigs(config);
};

export const darkModeTokens = (withSemanticRoles = true) => {
  const config = [
    shadowTokenConfig("dark"),
    opacityTokenConfig("dark"),
    // withSemanticRoles ? semanticTokensForAllRoles() : {},
    // semanticRootTokens("dark"),
    DarkTokens,
  ];

  return mergeConfigs(config);
};

export const scaleTokens = () => {
  const config = [radiusTokenConfig, breakpointTokenConfig];
  return mergeConfigs(config);
};

export const fontTokens = () => {
  const config = [fontTokenConfig];
  return mergeConfigs(config);
};

export const nonColorTokens = () => {
  const config = [scaleTokens(), fontTokens()];
  return mergeConfigs(config);
};
