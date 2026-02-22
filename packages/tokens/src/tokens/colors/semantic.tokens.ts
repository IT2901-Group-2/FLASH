import { ColorRole } from "@/types/output.types";
import { NeutralColorTokenConfig } from "./roles/neutral.tokens";
import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { merge } from "@/utils/merge";

const ColorTokenRoleConfig: Record<ColorRole, StyleDictionaryTokenConfig<"color">> = {
  neutral: NeutralColorTokenConfig,
};

export const ColorTokensForAllRoles = () => {
  const a = Object.values(ColorTokenRoleConfig).reduce(
    (acc, config) => merge(acc, config),
    {} as StyleDictionaryTokenConfig<"color">
  );
  return a;
};
