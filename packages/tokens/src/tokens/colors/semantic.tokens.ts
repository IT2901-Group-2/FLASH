import { ColorRole } from "@/types/output.types";
import { NeutralColorTokenConfig } from "./roles/neutral.tokens";
import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { merge } from "@/utils/merge";
import { AccentColorTokenConfig } from "./roles/accent.tokens";
import { SuccessColorTokenConfig } from "./roles/success.tokens";
import { WarningColorTokenConfig } from "./roles/warning.tokens";
import { DangerColorTokenConfig } from "./roles/danger.tokens";
import { PurpleColorTokenConfig } from "./roles/brand-purple.tokens";

export const ColorTokenRoleConfig: Record<
  ColorRole,
  StyleDictionaryTokenConfig<"color">
> = {
  neutral: NeutralColorTokenConfig,
  accent: AccentColorTokenConfig,
  success: SuccessColorTokenConfig,
  warning: WarningColorTokenConfig,
  danger: DangerColorTokenConfig,
  purple: PurpleColorTokenConfig,
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
