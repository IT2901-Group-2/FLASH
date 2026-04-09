import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    clearMocks: true,
    restoreMocks: true,
    setupFiles: ["@testing-library/jest-dom/vitest", "./vitest.setup.tsx"],
    coverage: {
      provider: "istanbul",
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test-setup": path.resolve(__dirname, "./vitest.setup"),
      "@test-config": path.resolve(__dirname, "./__mocks__"),
    },
  },
});
