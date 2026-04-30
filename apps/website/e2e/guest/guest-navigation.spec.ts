import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test.describe("Guest navigation", () => {
  test("Guest joining an event", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/guest-navigation.har.zip", { url: "**/api/**" });

    await page.goto("http://localhost:3000/no");
    await page.getByRole("textbox", { name: "Eventkode" }).click();
    await page.getByRole("textbox", { name: "Eventkode" }).fill("TMN1N2");
    await page.getByRole("button", { name: "Bli med" }).click();

    // await page.getByRole("textbox", { name: "Kallenavn" }).click();
    await page.getByRole("textbox", { name: "Kallenavn" }).fill("Playwright Bot");
    await page.getByRole("button", { name: "Bli med" }).click();
  });
});
