import { mergeConfigs } from "./tokens.utils";
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
