import path from "path";
import { test, expect } from "./fixtures";
import { createHash } from "crypto";
import fs from "fs";

async function getFileHash(path: string): Promise<string> {
  const hash = createHash("md5");
  await fs.createReadStream(path).forEach(async chunk => {
    hash.update(chunk);
  });
  return hash.digest("hex");
}

test("Guest navigation test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("DBZ78S", "Playwright Guest");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Guest");
  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Guest");
});

test("Guest upload test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("DBZ78S", "Playwright Guest");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload Image" }).click();
  const fileChooser = await fileChooserPromise;
  fileChooser.setFiles(
    path.join(__dirname, "fixtures", "images", "sample-wedding-3.jpg")
  );
  await page.getByRole("button", { name: "Dismiss toast" }).click();

  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 3 of" })).toBeVisible();
  await page.getByRole("radio", { name: "Your Photos" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await joinEvent("HSOUKJ", "Playwright Guest");
  await expect(page.getByRole("status")).toMatchAriaSnapshot(
    `- status: You haven't uploaded any photos yet`
  );

  const fileChooserPromise2 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload Image" }).click();
  const fileChooser2 = await fileChooserPromise2;
  fileChooser2.setFiles(
    path.join(__dirname, "fixtures", "images", "sample-wedding-3.jpg")
  );
  await page.getByRole("button", { name: "Dismiss toast" }).click();

  await expect(
    page.getByRole("button", { name: "Photo 1 of 1 Pending..." })
  ).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Pending...");
});

test("Guest download test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("1GAX9V", "Playwright Guest");
  await expect(page.locator("h1")).toContainText("Test event 3");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Images" }).click();
  const hash = await downloadPromise.then(d => d.path()).then(path => getFileHash(path));
  expect(hash).toBe("9cc2e6e007fcabc2e8da87c38c3fb59e");
});

test("Guest preview/slideshow test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("DBZ78S", "Playwright Guest");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();
  await page.getByRole("button", { name: "Photo 1 of" }).click();
  await expect(page.getByRole("img", { name: "Image 1 of" })).toBeVisible();
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(4).click();
  await expect(page.getByRole("img", { name: "Image 2 of" })).toBeVisible();
  await page.getByRole("button").nth(5).click();
  await page.getByRole("button", { name: "Slideshow" }).click();
  await page.waitForURL("**/events/*/slideshow");

  await expect(page.locator("img")).toBeVisible();
  await expect(page.getByRole("heading")).toContainText("Test event 1");
  await expect(page.getByRole("paragraph")).toContainText("1 of 2");
  await expect(page.locator("div").filter({ hasText: "DBZ78S" }).nth(2)).toBeVisible();
});
