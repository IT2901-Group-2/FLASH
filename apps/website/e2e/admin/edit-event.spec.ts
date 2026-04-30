import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test.describe("Edit Event", () => {
  test("Admin editing an event", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/edit-event.har.zip", { url: "**/api/**" });

    await page.goto("http://localhost:3000/no");
    await page.getByRole("link", { name: "Administrator" }).click();
    await page.getByRole("textbox", { name: "Passord" }).click();
    await page.getByRole("textbox", { name: "Passord" }).fill("Default");
    await page.getByRole("textbox", { name: "Passord" }).press("Enter");
    await page.getByRole("button", { name: "Logg inn" }).click();
    await page.getByTestId("edit-button").click();
    await page
      .getByTestId("edit-event-dialog")
      .getByTestId("name")
      .fill("Playwright Test Edit");
    await page.getByTestId("edit-event-dialog").getByTestId("description").click();
    await page
      .getByTestId("edit-event-dialog")
      .getByTestId("description")
      .press("ControlOrMeta+Shift+ArrowLeft");
    await page
      .getByTestId("edit-event-dialog")
      .getByTestId("description")
      .press("ControlOrMeta+Shift+ArrowLeft");
    await page
      .getByTestId("edit-event-dialog")
      .getByTestId("description")
      .fill("Playwright Edit Description");
    await page.getByRole("radio", { name: "Hele dagen" }).click();
    await page.getByRole("button", { name: "Neste" }).click();
    await page.getByRole("radio", { name: "Begrenset" }).click();
    await page.getByRole("textbox", { name: "*" }).click();
    await page.getByRole("textbox", { name: "*" }).fill("10");
    await page.getByRole("switch", { name: "Godkjenn bilder automatisk" }).check();
    await page.getByRole("switch", { name: "La gjester se alle bilder" }).check();
    await page.getByRole("button", { name: "Lagre" }).click();
  });
});
