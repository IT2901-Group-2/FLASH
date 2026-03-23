import { StyleDictionaryTokenConfig } from "@/tokens.utils";
import { ColorRole } from "@/types/output.types";

export const dataColorTokensConfig = (color: ColorRole) => {
  return {
    color: {
      base: {
        value: `{${color}.base.value}`,
        type: "data-color",
      },
      dark: {
        value: `{${color}.base.value}`,
        type: "data-color",
      },
      light: {
        value: `{${color}.base.value}`,
        type: "data-color",
      },
    },
  } satisfies StyleDictionaryTokenConfig<"data-color">;
};
