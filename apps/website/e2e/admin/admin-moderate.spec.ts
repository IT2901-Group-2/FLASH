import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/admin-moderate.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await page
    .getByText(
      "Playwright Test29. apr. 2026, 00:00Bilder totalt 1Godkjent 0Venter 1Ingen"
    )
    .click();
  await page.getByRole("button", { name: "Bli med" }).click();
  await page.getByRole("radio", { name: "Dine bilder" }).click();
  await expect(
    page.getByRole("button", { name: "Bilde 1 av 1 Ventende..." })
  ).toBeVisible();
  await page.getByRole("button", { name: "Moderer" }).click();
  await page.getByRole("button", { name: "Velg" }).click();
  await page.getByRole("button", { name: "Bilde 1 av" }).click();
  await page.getByRole("button", { name: "Avvis valgte bilder" }).click();
  await page.getByRole("radio", { name: "Avvist" }).click();
  await expect(page.getByRole("button", { name: "Bilde 1 av" })).toBeVisible();
  await page.getByRole("button", { name: "Velg" }).click();
  await page.getByRole("button", { name: "Bilde 1 av" }).click();
  await page.getByRole("button", { name: "Godkjenn valgte bilder" }).click();
  await page.getByRole("radio", { name: "Godkjent" }).click();
  await expect(page.getByRole("button", { name: "Bilde 1 av" })).toBeVisible();
  await page.getByRole("button", { name: "Gå tilbake" }).click();
  await expect(page.getByRole("button", { name: "Bilde 1 av" })).toBeVisible();
});
