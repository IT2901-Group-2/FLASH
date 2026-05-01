import { test, expect } from "./fixtures";

test("Guest joining an event old", async ({ page, appUrl }) => {
  await page.goto(`${appUrl}/en`);
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("DBZ78S");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("header")).toMatchAriaSnapshot(`
  - heading "Test event 1" [level=1]
  - text: Playwright Guest You can upload 1 photo
  `);
});
