import { test, expect } from "./fixtures";

test("Guest navigation test", async ({ page, appUrl }) => {
  await page.goto(`${appUrl}/en`);
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("DBZ78S");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

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
