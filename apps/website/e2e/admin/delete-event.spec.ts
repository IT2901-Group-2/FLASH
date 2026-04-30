import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test.describe("Delete Event", () => {
  test("Admin deleteing an event", async ({ page }) => {
    await page.routeFromHAR("e2e/hars/delete-event.har.zip", {
      url: "**/api/**",
    });

    await page.goto("http://localhost:3000/no");
    await page.getByRole("link", { name: "Administrator" }).click();
    await page.getByRole("textbox", { name: "Passord" }).click();
    await page.getByRole("textbox", { name: "Passord" }).fill("Default");
    await page.getByRole("button", { name: "Logg inn" }).click();
    await page.getByTestId("delete-button").click();
    await page.getByRole("button", { name: "Slett" }).click();
  });
});
