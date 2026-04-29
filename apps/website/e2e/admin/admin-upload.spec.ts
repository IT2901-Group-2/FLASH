import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/admin-upload.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await page.getByText("Playwright Test").click();
  await page.getByRole("button", { name: "Bli med" }).click();
  await page.getByRole("button", { name: "Last opp bilde" }).click();
  await page
    .getByRole("button", { name: "Last opp bilde" })
    .setInputFiles("e2e/test-img.png");
  await page.getByRole("radio", { name: "Dine bilder" }).click();
  await expect(
    page.getByRole("button", { name: "Bilde 2 av 2 Ventende..." })
  ).toBeVisible();
});
