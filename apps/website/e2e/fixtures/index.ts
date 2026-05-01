import { test as base } from "@playwright/test";
import { spawn } from "child_process";
import getPort from "get-port";
import waitOn from "wait-on";
import fs from "fs/promises";
import path from "path";
import os from "os";

const DB_FIXTURE_DIR = path.join(__dirname, "db");
const DATE_MOCKER = path.join(__dirname, "mock-date.js");
const MOCK_DATE = "2026-05-01T10:00:00Z";

type AppFixture = {
  appUrl: string;
};

export const test = base.extend<AppFixture>({
  appUrl: async ({ page }, use) => {
    const STORAGE_DIR = await fs.mkdtemp(path.join(os.tmpdir(), "flash-playwright-"));
    await fs.cp(DB_FIXTURE_DIR, STORAGE_DIR, { recursive: true });

    await page.clock.install({ time: MOCK_DATE });

    const port = await getPort();
    const app = spawn("pnpm", ["start", "-p", `${port}`], {
      env: {
        ...process.env,
        STORAGE_DIR,
        MOCK_DATE,
        NODE_OPTIONS: `--require ${DATE_MOCKER}`,
      },
      shell: true,
    });

    const appUrl = `http://localhost:${port}`;
    await waitOn({ resources: [appUrl] }).then(() => use(appUrl));

    if (!app.killed) {
      app.kill("SIGTERM");
    }

    await fs.rm(STORAGE_DIR, { recursive: true });
  },
});
export { expect } from "@playwright/test";
