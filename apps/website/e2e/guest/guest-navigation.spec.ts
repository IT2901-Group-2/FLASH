import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test.describe("Guest navigation", () => {
  test("Guest joining an event", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/guest-navigation.har.zip", { url: "**/api/**" });

    await page.goto("http://localhost:3000/en");
    await page.getByRole("textbox", { name: "Event Code" }).click();
    await page.getByRole("textbox", { name: "Event Code" }).fill("QNUTZV");
    await page.getByRole("button", { name: "Join Event" }).click();
    await page.waitForURL("**/join/*");

    await page.getByRole("textbox", { name: "Nickname" }).click();
    await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest 5");
    await page.getByRole("button", { name: "Join Event" }).click();
    await page.waitForURL("**/events/*");

    await page.getByTestId("sidebar-trigger").click();
    await page.getByRole("button", { name: "Back" }).click();
    await page.waitForURL("**/en");

    await page
      .locator("div")
      .filter({ hasText: "Playwright test 2Unlimited" })
      .nth(3)
      .click();
    await expect(page.locator("header")).toMatchAriaSnapshot(`
    - heading "Playwright test 2" [level=1]
    - text: Playwright Guest 5 You can upload unlimited photos
    `);
  });
});
