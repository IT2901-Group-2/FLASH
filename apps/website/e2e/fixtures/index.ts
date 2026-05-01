import { test as base, Page } from "@playwright/test";
import { spawn } from "child_process";
import { createReadStream } from "fs";
import { createHash } from "crypto";
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
  joinEvent: (code: string, nickname: string) => Promise<void>;
  login: (password?: string) => Promise<void>;
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

  joinEvent: ({ page }, _use) => _use((...params) => joinEvent(page, ...params)),
  login: ({ page }, _use) => _use((...params) => login(page, ...params)),
});
export { expect } from "@playwright/test";

async function joinEvent(page: Page, code: string, nickname: string): Promise<void> {
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill(code);
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill(nickname);
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");
}

async function login(page: Page, password: string = "Default"): Promise<void> {
  await page.getByRole("link", { name: "Admin" }).click();
  await page.waitForURL("**/admin");

  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin/dashboard");
}

export async function getFileHash(path: string): Promise<string> {
  const hash = createHash("md5");
  await createReadStream(path).forEach(async chunk => {
    hash.update(chunk);
  });
  return hash.digest("hex");
}
