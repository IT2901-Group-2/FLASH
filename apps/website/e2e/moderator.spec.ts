import { test, expect } from "./fixtures";
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
