// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores(["dist/**", "storybook-static/**"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "_",
          argsIgnorePattern: "_",
          caughtErrorsIgnorePattern: "_",
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
