import { test as base } from "@playwright/test";
import { spawn } from "child_process";
import getPort from "get-port";
import waitOn from "wait-on";
import fs from "fs/promises";
import AdmZip from "adm-zip";
import path from "path";
import os from "os";

/** The fake date that will be injected into the running NextJS server and browsers */
const MOCK_DATE = "2026-05-01T10:00:00Z";

export const test = base.extend<{ appUrl: string }>({
  appUrl: async ({ page }, use) => {
    // Unpack db fixture into a temporary folder
    const STORAGE_DIR = await fs.mkdtemp(path.join(os.tmpdir(), "flash-playwright-"));
    new AdmZip(path.join(__dirname, "db.zip")).extractAllTo(STORAGE_DIR);

    // Inject fake date into Playwright browsers
    await page.clock.install({ time: MOCK_DATE });

    // Start NextJS server with temp folder and mock date
    const port = await getPort();
    const app = spawn("pnpm", ["start", "-p", `${port}`], {
      env: {
        ...process.env,
        STORAGE_DIR,
        MOCK_DATE,
        NODE_OPTIONS: `--require ${path.join(__dirname, "date-mocker.js")}`,
      },
    });

    // Pass correct app url to Playwright tests
    const appUrl = `http://localhost:${port}`;
    await waitOn({ resources: [appUrl] }).then(() => use(appUrl));

    // Kill NextJS server when done
    if (!app.killed) {
      app.kill("SIGTERM");
    }

    // Delete temporary folder
    await fs.rm(STORAGE_DIR, { recursive: true });
  },
});

export { expect } from "@playwright/test";
