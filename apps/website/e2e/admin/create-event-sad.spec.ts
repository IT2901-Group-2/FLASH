import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/create-event-sad.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await page.getByRole("button", { name: "Lag nytt event" }).click();
  await page.getByRole("textbox", { name: "Eventnavn" }).fill("Playwright Sad Event");
  await page.getByRole("textbox", { name: "Eventnavn" }).press("ControlOrMeta+a");
  await page.getByRole("textbox", { name: "Eventnavn" }).fill("");
  await expect(page.getByText("Dette feltet er påkrevd")).toBeVisible();
  await page.getByRole("radio", { name: "Spesifikke tider" }).click();
  await page.getByRole("textbox", { name: "Starttid" }).click();
  await page.getByRole("textbox", { name: "Starttid" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "Starttid" }).fill("18:00");
  await page.getByRole("button", { name: "Neste" }).click();
  await expect(page.getByText("Starttid må være før sluttid.")).toBeVisible();
  await page.getByRole("textbox", { name: "Eventnavn" }).click();
  await page.getByRole("textbox", { name: "Eventnavn" }).fill("Sad Event");
  await page.getByRole("textbox", { name: "Sluttid" }).click();
  await page.getByRole("textbox", { name: "Sluttid" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "Sluttid" }).fill("21:00");
  await page.getByRole("button", { name: "Neste" }).click();
  await page.getByRole("radio", { name: "Uendelig" }).click();
  await page.getByRole("radio", { name: "Begrenset" }).click();
  await page.getByRole("button", { name: "Opprett" }).click();
  await expect(
    page.getByText("Velg en opplastningsgrense", { exact: true })
  ).toBeVisible();
  await page.getByRole("radio", { name: "Uendelig" }).click();
  await page.getByRole("switch", { name: "Godkjenn bilder automatisk" }).check();
  await page.getByRole("switch", { name: "La gjester se alle bilder" }).uncheck();
  await page.getByRole("button", { name: "Opprett" }).click();
  await page.getByTestId("copy-button").click();
  await page.getByRole("radio", { name: "Moderator" }).click();
  await page.getByTestId("copy-button").click();
  await page.getByRole("button", { name: "Fullfør" }).click();
});
