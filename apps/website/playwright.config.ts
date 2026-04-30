import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "os";
import path from "path";

export const DB_TEMP_DIR = path.join(tmpdir(), "flash-playwright");
export const DB_FIXTURE_DIR = path.join(__dirname, "e2e", "db");

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  globalSetup: "./playwright.setup.ts",
  globalTeardown: "./playwright.teardown.ts",

  use: {
    baseURL: "http://localhost:3000",
    trace: process.env.CI ? "off" : "retain-on-failure",
    screenshot: process.env.CI ? "off" : "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
  ],

  webServer: {
    command: `STORAGE_DIR=${DB_TEMP_DIR} pnpm start`,
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    wait: { stdout: /(Loaded|Couldn't load) existing database/ },
  },
});
