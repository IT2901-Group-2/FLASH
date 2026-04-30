import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test.describe("Moderator navigation", () => {
  test("Join", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/guest-navigation.har.zip", { url: "**/api/**" });

    await page.goto("http://localhost:3000/no");
    await page.getByRole("textbox", { name: "Eventkode" }).click();
    await page.getByRole("textbox", { name: "Eventkode" }).fill("TMN1N2");
    await page.getByRole("button", { name: "Bli med" }).click();

    await page.getByRole("textbox", { name: "Kallenavn" }).click();
    await page.getByRole("textbox", { name: "Kallenavn" }).fill("Playwright Bot");
    await page.getByRole("button", { name: "Bli med" }).click();
  });

  test.skip("Moderate", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/moderator-navigation.har.zip", {
      url: "**/api/**",
    });
    await page.goto("http://localhost:3000/no/events/yQAXm2");
    await page.getByRole("radio", { name: "Dine bilder" }).click();
    await expect(page.locator("header")).toMatchAriaSnapshot(`- text: Moderer`);
    await page.getByRole("button", { name: "Moderer" }).click();
    await page.getByRole("radio", { name: "Godkjent" }).click();
    await page.getByRole("radio", { name: "Avvist" }).click();
    await page.getByRole("button", { name: "Gå tilbake" }).click();
  });
});
