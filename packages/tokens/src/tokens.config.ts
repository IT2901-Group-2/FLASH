import { mergeConfigs } from "./tokens.utils";
import { breakpointTokenConfig } from "./tokens/breakpoints";
import { DarkTokens, LightTokens } from "./tokens/colors/color.tokens";
import { semanticRootTokens } from "./tokens/colors/roles/root.tokens";
import { ColorTokensForAllRoles } from "./tokens/colors/semantic.tokens";
import { fontTokenConfig } from "./tokens/font";
import { opacityTokenConfig } from "./tokens/opacity";
import { radiusTokenConfig } from "./tokens/radius";
import { shadowTokenConfig } from "./tokens/shadow";

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

export const roleTokens = () => {
  const config = [LightTokens, ColorTokensForAllRoles()];
  return mergeConfigs(config);
};

export const scaleTokens = () => {
  const config = [radiusTokenConfig, breakpointTokenConfig];
  return mergeConfigs(config);
};

export const rootTokens = () => {
  const config = [scaleTokens(), fontTokenConfig, breakpointTokenConfig];
  return mergeConfigs(config);
};

export const allTokens = () => {
  const config = [
    lightModeTokens(),
    scaleTokens(),
    breakpointTokenConfig,
    fontTokenConfig,
  ];

  return mergeConfigs(config);
};
