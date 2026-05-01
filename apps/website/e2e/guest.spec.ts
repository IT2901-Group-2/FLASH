import path from "path";
import { test, expect } from "./fixtures";

test("Guest navigation test", async ({ page, appUrl }) => {
  await page.goto(`${appUrl}/en`);
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("DBZ78S");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Guest");
  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Playwright Guest");
});

test("Guest upload test", async ({ page, appUrl }) => {
  await page.goto(`${appUrl}/en`);
  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("DBZ78S");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload Image" }).click();
  const fileChooser = await fileChooserPromise;
  fileChooser.setFiles(
    path.join(__dirname, "fixtures", "images", "sample-wedding-3.jpg")
  );
  await page.getByRole("button", { name: "Dismiss toast" }).click();

  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 3 of" })).toBeVisible();
  await page.getByRole("radio", { name: "Your Photos" }).click();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await page.getByTestId("sidebar-trigger").last().click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForURL("**/en");

  await page.getByRole("textbox", { name: "Event Code" }).click();
  await page.getByRole("textbox", { name: "Event Code" }).fill("HSOUKJ");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/join/*");

  await page.getByRole("textbox", { name: "Nickname" }).click();
  await page.getByRole("textbox", { name: "Nickname" }).fill("Playwright Guest");
  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.getByRole("status")).toMatchAriaSnapshot(
    `- status: You haven't uploaded any photos yet`
  );

  const fileChooserPromise2 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload Image" }).click();
  const fileChooser2 = await fileChooserPromise2;
  fileChooser2.setFiles(
    path.join(__dirname, "fixtures", "images", "sample-wedding-3.jpg")
  );
  await page.getByRole("button", { name: "Dismiss toast" }).click();

  await expect(
    page.getByRole("button", { name: "Photo 1 of 1 Pending..." })
  ).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Pending...");
});
