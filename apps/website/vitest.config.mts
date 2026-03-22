import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    clearMocks: true,
    restoreMocks: true,
    setupFiles: ["@testing-library/jest-dom/vitest", "./vitest.setup.tsx"],
    coverage: {
      provider: "istanbul",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test-setup": path.resolve(__dirname, "./vitest.setup"),
      "@mocks": path.resolve(__dirname, "./__mocks__"),
    },
  },
});
