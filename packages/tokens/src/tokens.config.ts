import { mergeConfigs } from "./tokens.utils";
import { breakpointTokenConfig } from "./tokens/breakpoints";
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
    // globalLightTokens,
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
