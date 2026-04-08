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
      "@test": path.resolve(__dirname, "./vitest.setup"),
      // "@test-config": path.resolve(__dirname, "./__mocks__"), // Commented out because it makes a test not pass. Will get fixed when tests get reworked
    },
  },
});
