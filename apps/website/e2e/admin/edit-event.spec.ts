import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/edit-event.har", { url: "**/api/**" });

  await page.goto("http://localhost:3000/no");
  await page.getByRole("link", { name: "Administrator" }).click();
  await page.getByRole("textbox", { name: "Passord" }).click();
  await page.getByRole("textbox", { name: "Passord" }).fill("Default");
  await page.getByRole("button", { name: "Logg inn" }).click();
  await page.getByTestId("edit-button").click();
  await page.getByTestId("edit-event-dialog").getByTestId("name").click();
  await page
    .getByTestId("edit-event-dialog")
    .getByTestId("name")
    .fill("Playwright Test Event");
  await page.getByTestId("edit-event-dialog").getByTestId("description").click();
  await page
    .getByTestId("edit-event-dialog")
    .getByTestId("description")
    .press("ControlOrMeta+a");
  await page
    .getByTestId("edit-event-dialog")
    .getByTestId("description")
    .fill("New Description");
  await page.getByRole("radio", { name: "Spesifikke tider" }).click();
  await page.getByRole("button", { name: "Neste" }).click();
  await page.getByRole("radio", { name: "Begrenset" }).click();
  await page.getByRole("textbox", { name: "*" }).click();
  await page.getByRole("textbox", { name: "*" }).fill("25");
  await page.getByRole("switch", { name: "Godkjenn bilder automatisk" }).check();
  await page.getByRole("switch", { name: "La gjester se alle bilder" }).uncheck();
  await page.getByRole("button", { name: "Lagre" }).click();
});
