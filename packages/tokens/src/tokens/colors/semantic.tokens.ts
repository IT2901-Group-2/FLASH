import { ColorRole } from "@/types/output.types";
import { NeutralColorTokenConfig } from "./roles/neutral.tokens";
import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { merge } from "@/utils/merge";
import { AccentColorTokenConfig } from "./roles/accent.tokens";

export const ColorTokenRoleConfig: Record<
  ColorRole,
  StyleDictionaryTokenConfig<"color">
> = {
  neutral: NeutralColorTokenConfig,
  accent: AccentColorTokenConfig,
};

/**
 * Generates a merged configuration object containing color tokens for all defined color roles.
 * @returns A merged configuration object containing color tokens for all defined color roles.
 */
export const ColorTokensForAllRoles = () => {
  const a = Object.values(ColorTokenRoleConfig).reduce(
    (acc, config) => merge(acc, config),
    {} as StyleDictionaryTokenConfig<"color">
  );
  return a;
};
