import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async config => {
    // Merge custom configuration into the default config
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": resolve(__dirname, "../src"),
        "@components": resolve(__dirname, "../src/components"),
        "@utils": resolve(__dirname, "../src/utils"),
        "@styles": resolve(__dirname, "../src/styles"),
        "@docs": resolve(__dirname, "../src/docs"),
        "@docs-components": resolve(__dirname, "../src/docs/components"),
      };
    }
    return config;
  },
};
export default config;
