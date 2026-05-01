import { test } from "./fixtures";

test("Guest joining an event old", async ({ page, appUrl }) => {
  const nickname = "guest-playwright";

  await page.goto(`${appUrl}/en`);
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("S91UFJ");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill(nickname);
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.locator("div").filter({ hasText: "Test event 1Unlimited" }).nth(3).click();
  await page.waitForURL("**/events/*");

  // await expect(page.locator("header")).toMatchAriaSnapshot(`
  // - heading "Test event 1" [level=1]
  // - text: ${nickname} You can upload unlimited photos
  // `);
});
