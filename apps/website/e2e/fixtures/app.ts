import { test as base } from "@playwright/test";
import { spawn } from "child_process";
import getPort from "get-port";
import waitOn from "wait-on";
import fs from "fs/promises";
import path from "path";
import os from "os";

const DB_FIXTURE_DIR = path.join(__dirname, "db");

type AppFixture = {
  appUrl: string;
};

export const test = base.extend<AppFixture>({
  appUrl: async ({}, use) => {
    const STORAGE_DIR = await fs.mkdtemp(path.join(os.tmpdir(), "flash-playwright-"));
    await fs.cp(DB_FIXTURE_DIR, STORAGE_DIR, { recursive: true });

    const port = await getPort();
    const app = spawn("pnpm", ["start", "-p", port.toString()], {
      env: { ...process.env, STORAGE_DIR },
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
