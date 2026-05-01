import { test, expect, getFileHash } from "./fixtures";
import path from "path";

test("Moderator navigation test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("8OGLU2", "Playwright Moderator");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Moderator");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Moderator");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
});

test("Moderator upload test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("8OGLU2", "Playwright Moderator");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
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

  await joinEvent("6YGE73", "Playwright Moderator");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
  await expect(page.getByRole("status")).toMatchAriaSnapshot(`- status: No photos found`);

  const fileChooserPromise2 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload Image" }).click();
  const fileChooser2 = await fileChooserPromise2;
  fileChooser2.setFiles(
    path.join(__dirname, "fixtures", "images", "sample-wedding-3.jpg")
  );
  await page.getByRole("button", { name: "Dismiss toast" }).click();

  await page.getByRole("radio", { name: "Your Photos" }).click();
  await expect(
    page.getByRole("button", { name: "Photo 1 of 1 Pending..." })
  ).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Pending...");
});

test("Moderator download test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("TJ4X33", "Playwright Moderator");
  await expect(page.locator("h1")).toContainText("Test event 3");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Images" }).click();
  const hash = await downloadPromise.then(d => d.path()).then(path => getFileHash(path));
  expect(hash).toBe("9cc2e6e007fcabc2e8da87c38c3fb59e");
});

test("Moderator preview/slideshow test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("8OGLU2", "Playwright Moderator");
  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
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

test("Moderator moderation test", async ({ page, appUrl, joinEvent }) => {
  await page.goto(`${appUrl}/en`);

  await joinEvent("6YGE73", "Playwright Moderator");
  await page.getByRole("button", { name: "Moderate" }).click();
  await page.waitForURL("**/events/*/moderate");

  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await page.getByRole("radio", { name: "Approved" }).click();
  await expect(page.getByRole("status")).toMatchAriaSnapshot(
    `- status: No approved photos found`
  );
  await page.getByRole("radio", { name: "Rejected" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await page.getByRole("button", { name: "Select" }).click();
  await page.getByRole("button", { name: "Photo 1 of" }).click();
  await page.getByRole("button", { name: "Approve selected photos" }).click();
  await expect(page.getByRole("status")).toMatchAriaSnapshot(
    `- status: No rejected photos found`
  );
  await page.getByRole("radio", { name: "Approved" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await page.getByRole("radio", { name: "Pending" }).click();
  await page.getByRole("button", { name: "Select" }).click();
  await page.getByRole("button", { name: "Photo 1 of" }).click();
  await page.getByRole("button", { name: "Approve selected photos" }).click();
  await expect(page.getByRole("status")).toMatchAriaSnapshot(
    `- status: No pending photos found`
  );
  await page.getByRole("radio", { name: "Approved" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();
});
