import { ColorRole } from "@/types/output.types";
import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { merge } from "@/utils/merge";
import { AccentColorTokenConfig } from "./roles/accent.tokens";
import { SuccessColorTokenConfig } from "./roles/success.tokens";
import { WarningColorTokenConfig } from "./roles/warning.tokens";
import { DangerColorTokenConfig } from "./roles/danger.tokens";
import { BrandPurpleColorTokenConfig } from "./roles/brand-purple.tokens";
import { PrimaryColorTokenConfig } from "./roles/primary.tokens";
import { NeutralColorTokenConfig } from "./roles/neutral.tokens";

export const ColorTokenRoleConfig: Record<
  Exclude<ColorRole, "background">,
  StyleDictionaryTokenConfig<"color">
> = {
  neutral: NeutralColorTokenConfig,
  primary: PrimaryColorTokenConfig,
  accent: AccentColorTokenConfig,
  success: SuccessColorTokenConfig,
  warning: WarningColorTokenConfig,
  danger: DangerColorTokenConfig,
  "brand-purple": BrandPurpleColorTokenConfig,
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
