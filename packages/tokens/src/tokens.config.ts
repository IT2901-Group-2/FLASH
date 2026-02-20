import { mergeConfigs } from "./tokens.utils";
import { radiusTokenConfig } from "./tokens/radius";
import { shadowTokenConfig } from "./tokens/shadow";

export const lightModeTokens = (withSemanticRoles = true) => {
  const config = [
    shadowTokenConfig("light"),
    // opacityTokenConfig("light"),
    // withSemanticRoles ? semanticTokensForAllRoles() : {},
    // semanticRootTokens("light"),
    // globalLightTokens,
  ];

  return mergeConfigs(config);
};

export const scaleTokens = () => {
  const config = [radiusTokenConfig];

  return mergeConfigs(config);
};

export const allTokens = () => {
  const config = [scaleTokens()];

  return mergeConfigs(config);
};
