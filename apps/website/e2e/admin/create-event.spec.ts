import { test, expect } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/create-event.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await page.getByRole("button", { name: "Lag nytt event" }).click();
  await page.getByTestId("name").fill("Playwright Test Event");
  await page.getByTestId("description").click();
  await page.getByTestId("description").fill("Playwright Test Description");
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
  await page.getByRole("button", { name: "Opprett" }).click();
  await page.getByRole("button", { name: "Last ned" }).click();
  const downloadPromise = page.waitForEvent("download");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatchSnapshot();
  await page.getByRole("radio", { name: "Moderator" }).click();
  await page.getByRole("button", { name: "Last ned" }).click();
  const download1Promise = page.waitForEvent("download");
  const download1 = await download1Promise;
  expect(download1.suggestedFilename()).toMatchSnapshot();
  await page.getByTestId("copy-button").click();
  await page.getByRole("button", { name: "Fullfør" }).click();
});
