import { test } from "@playwright/test";

test.use({
  serviceWorkers: "block",
});

test("test", async ({ page }) => {
  await page.routeFromHAR("e2e/hars/guest-navigation.har.zip", {
    url: "**/api/**",
  });
  await page.goto("http://localhost:3000/no");
  await page.getByRole("textbox", { name: "Eventkode" }).click();
  await page.getByRole("textbox", { name: "Eventkode" }).fill("B7NKTR");
  await page.getByRole("button", { name: "Bli med" }).click();

  await new Promise(r => setTimeout(r, 1000));

  await page.getByRole("textbox", { name: "Kallenavn" }).click();
  await page.getByRole("textbox", { name: "Kallenavn" }).fill("Playwright");
  await page.getByText("Bli med").click();

  await new Promise(r => setTimeout(r, 2000));

  await page.getByTestId("sidebar-trigger").click();
  await page.getByRole("button", { name: "Lys modus" }).click();
  await page.getByRole("button", { name: "Språk EN NO" }).click();

  await new Promise(r => setTimeout(r, 1000));

  await page.getByTestId("sidebar-trigger").click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("Playwright Test").click();
  await page.getByRole("main").getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button", { name: "Close" }).click();
});
