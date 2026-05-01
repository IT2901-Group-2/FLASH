import { test, expect } from "./fixtures";

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
