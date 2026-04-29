import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/admin-navigate.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await expect(
    page.getByText(
      "Playwright Test29. apr. 2026, 00:00Bilder totalt 1Godkjent 1Venter 0Ingen"
    )
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Aktive" }).click();
  await expect(
    page.getByText(
      "Playwright Test29. apr. 2026, 00:00Bilder totalt 1Godkjent 1Venter 0Ingen"
    )
  ).toBeVisible();
  await page
    .getByText(
      "Playwright Test29. apr. 2026, 00:00Bilder totalt 1Godkjent 1Venter 0Ingen"
    )
    .click();
  await page.getByRole("button", { name: "Del event" }).click();
  await page.getByRole("button", { name: "Del event" }).click();
  await page
    .locator("div")
    .filter({ hasText: "Del eventetDel QR-koden eller" })
    .nth(2)
    .click();
  await page.getByRole("radio", { name: "Moderator" }).click();
  await page.getByTestId("copy-button").click();
  await page.getByRole("button", { name: "Lukk" }).click();
  await page.getByRole("button", { name: "Bli med" }).click();
  await page.locator("header").getByRole("button").filter({ hasText: /^$/ }).click();
  await page
    .locator("div")
    .filter({ hasText: "B7NKTRSkann for å laste opp" })
    .nth(2)
    .click();
  await page.getByRole("button", { name: "Lukk" }).click();
  await page.getByRole("radio", { name: "Dine bilder" }).click();
  await page.getByRole("button", { name: "Moderer" }).click();
  await page.getByRole("radio", { name: "Godkjent" }).click();
  await page.getByRole("radio", { name: "Avvist" }).click();
  await page.getByRole("button", { name: "Gå tilbake" }).click();
  await page.getByRole("button", { name: "Bildefremvisning" }).click();
  await expect(page.locator("div").filter({ hasText: "B7NKTR" }).nth(2)).toBeVisible();
  await page.getByTestId("qr-button").click();
  await page.getByTestId("qr-button").click();
  await expect(page.locator("div").filter({ hasText: "B7NKTR" }).nth(2)).toBeVisible();
  await page.getByRole("button").first().click();
  await page.getByTestId("toggle-button").click();
  await page.getByRole("button").nth(2).click();
  await page.getByTestId("fullscreen-button").click();
  await page.getByTestId("fullscreen-button").click();
  await page.getByTestId("back-button").click();
  await page.getByRole("button", { name: "Kontrollpanel" }).click();
  await page.getByTestId("sidebar-trigger").click();
  await page.getByRole("button", { name: "Lys modus" }).click();
  await page.getByRole("button", { name: "Språk EN NO" }).click();
  await page.getByRole("button", { name: "Dark mode" }).click();

  await page.getByTestId("sidebar-trigger").click();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByText("Your EventsPlaywright")).toBeVisible();
  await page.getByRole("heading", { name: "Playwright Test" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
});
