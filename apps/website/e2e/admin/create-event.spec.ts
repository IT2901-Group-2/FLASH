import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("Create Event", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/create-event.har", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();

  await page.getByRole("button", { name: "Lag nytt event" }).click();
  await page.getByRole("textbox", { name: "Eventnavn" }).fill("Playwright Event");
  await page.getByRole("textbox", { name: "Eventnavn" }).press("Tab");
  await page.getByRole("textbox", { name: "Beskrivelse" }).fill("Playwright Description");
  await page.getByRole("radio", { name: "Spesifikke tider" }).click();
  await page.getByRole("textbox", { name: "Starttid" }).click();
  await page.getByRole("textbox", { name: "Starttid" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "Starttid" }).fill("12:00");
  await page.getByRole("textbox", { name: "Sluttid" }).click();
  await page.getByRole("textbox", { name: "Sluttid" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "Sluttid" }).fill("18:00");
  await page.getByRole("button", { name: "Neste" }).click();

  await page.getByRole("radio", { name: "Uendelig" }).click();
  await page.getByRole("switch", { name: "Godkjenn bilder automatisk" }).check();
  await page.getByRole("switch", { name: "La gjester se alle bilder" }).check();
  await page.getByRole("button", { name: "Opprett" }).click();
  await page.getByRole("button", { name: "Fullfør" }).click();
});
