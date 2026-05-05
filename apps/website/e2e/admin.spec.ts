import { test, expect, getFileHash } from "./fixtures";

test("Admin share test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/admin/dashboard/*");

  await expect(page.getByRole("heading")).toContainText("Test event 1");
  await page.getByRole("button", { name: "Share Event" }).click();
  await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
    - heading "Share Your Event" [level=2]
    - paragraph: Share the QR code or event link so others can join and upload photos.
    - radiogroup:
      - radio "Guest" [checked]
      - radio "Moderator"
    - img
    - text: DBZ78S Scan to upload photos
    - button "Download"
    - heading "Guest Link" [level=2]
    - paragraph: Anyone with this link can upload photos to the event.
    - textbox "Guest Link": /http:\\/\\/localhost:\\d+\\/join\\/DBZ78S/
    - button
    - button "Close"
    `);
  await page.getByRole("radio", { name: "Moderator" }).click();
  await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
    - heading "Share Your Event" [level=2]
    - paragraph: Share the QR code or event link so others can join and upload photos.
    - radiogroup:
      - radio "Guest"
      - radio "Moderator" [checked]
    - img
    - text: 8OGLU2 Scan to upload photos
    - button "Download"
    - heading "Moderator Link" [level=2]
    - paragraph: Anyone with this link can review and moderate uploaded photos.
    - textbox "Guest Link": /http:\\/\\/localhost:\\d+\\/join\\/8OGLU2/
    - button
    - button "Close"
    `);
});

test("Admin join test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/admin/dashboard/*");

  await page.getByRole("button", { name: "Join Event" }).click();
  await page.waitForURL("**/events/*");

  await expect(page.locator("h1")).toContainText("Test event 1");
  await expect(page.locator("header")).toContainText("Admin");
  await expect(page.getByRole("button", { name: "Moderate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 1 of" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Photo 2 of" })).toBeVisible();
});

test("Admin slideshow test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/admin/dashboard/*");

  await expect(page.getByRole("heading")).toContainText("Test event 1");
  await page.getByRole("button", { name: "Slideshow" }).click();
  await page.waitForURL("**/events/*/slideshow");

  await expect(page.locator("img")).toBeVisible();
  await expect(page.getByRole("heading")).toContainText("Test event 1");
  await expect(page.getByRole("paragraph")).toContainText("1 of 2");
  await expect(page.getByTestId("page")).toMatchAriaSnapshot(`
    - img
    - text: DBZ78S
    `);
});

test("Admin download test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByRole("heading", { name: "Test event 1" }).click();
  await page.waitForURL("**/admin/dashboard/*");

  await expect(page.getByRole("heading")).toContainText("Test event 1");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const hash = await downloadPromise.then(d => d.path()).then(getFileHash);
  expect(hash).toBe("40d9fff1ce9203c713eff4ff6deea49d");
});

test("Admin create event test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByRole("button", { name: "Create New Event" }).click();
  await page.getByRole("textbox", { name: "Event Name" }).click();
  await page.getByRole("textbox", { name: "Event Name" }).fill("New Event");
  await page.getByRole("textbox", { name: "Description" }).click();
  await page.getByRole("textbox", { name: "Description" }).fill("Event description");
  await page.getByRole("radio", { name: "Specific Time" }).click();
  await page.getByRole("textbox", { name: "Start Time" }).click();
  await page.getByRole("textbox", { name: "Start Time" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "Start Time" }).fill("12:00");
  await page.getByRole("textbox", { name: "End Time" }).click();
  await page.getByRole("textbox", { name: "End Time" }).press("Shift+Tab");
  await page.getByRole("textbox", { name: "End Time" }).fill("18:00");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("radio", { name: "Unlimited" }).click();
  await page.getByRole("switch", { name: "Automatically approve" }).check();
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.getByText("Guest Link")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
  await page.getByRole("radio", { name: "Moderator" }).click();
  await expect(page.getByText("Moderator Link")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByTestId("edit-button").nth(3).click();
  await expect(page.getByRole("textbox", { name: "Event Name" })).toHaveValue(
    "New Event"
  );
  await expect(page.getByRole("textbox", { name: "Description" })).toHaveValue(
    "Event description"
  );
  await expect(page.getByRole("textbox", { name: "Start Time" })).toHaveValue("12:00");
  await expect(page.getByRole("textbox", { name: "End Time" })).toHaveValue("18:00");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("radiogroup")).toMatchAriaSnapshot(`
    - radiogroup:
      - radio "Limited"
      - radio "Unlimited" [checked]
    `);
  await expect(page.getByRole("switch", { name: "Automatically approve" })).toBeChecked();
  await expect(
    page.getByRole("switch", { name: "Allow guests to view all" })
  ).toBeChecked();
});

test("Admin edit event test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await page.getByTestId("edit-button").nth(2).click();
  await expect(page.getByRole("textbox", { name: "Event Name" })).toHaveValue(
    "Test event 1"
  );
  await page.getByRole("textbox", { name: "Event Name" }).click();
  await page.getByRole("textbox", { name: "Event Name" }).fill("New name");
  await expect(page.getByRole("textbox", { name: "Description" })).toBeEmpty();
  await page.getByRole("textbox", { name: "Description" }).click();
  await page.getByRole("textbox", { name: "Description" }).fill("New description");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("radiogroup")).toMatchAriaSnapshot(`
    - radiogroup:
      - radio "Limited" [checked]
      - radio "Unlimited"
    `);
  await expect(page.getByRole("textbox", { name: "*" })).toHaveValue("1");
  await page.getByRole("textbox", { name: "*" }).click();
  await page.getByRole("textbox", { name: "*" }).fill("5");
  await expect(page.getByRole("switch", { name: "Automatically approve" })).toBeChecked();
  await expect(
    page.getByRole("switch", { name: "Allow guests to view all" })
  ).toBeChecked();
  await page.getByRole("switch", { name: "Automatically approve" }).uncheck();
  await page.getByRole("switch", { name: "Allow guests to view all" }).uncheck();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByTestId("edit-button").nth(2).click();
  await expect(page.getByRole("textbox", { name: "Event Name" })).toHaveValue("New name");
  await expect(page.getByRole("textbox", { name: "Description" })).toHaveValue(
    "New description"
  );
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("radiogroup")).toMatchAriaSnapshot(`
    - radiogroup:
      - radio "Limited" [checked]
      - radio "Unlimited"
    `);
  await expect(page.getByRole("textbox", { name: "*" })).toHaveValue("5");
  await expect(
    page.getByRole("switch", { name: "Automatically approve" })
  ).not.toBeChecked();
  await expect(
    page.getByRole("switch", { name: "Allow guests to view all" })
  ).not.toBeChecked();
});

test("Admin delete event test", async ({ page, appUrl, login }) => {
  await page.goto(`${appUrl}/en`);

  await login();
  await expect(page.getByRole("heading", { name: "Test event 3" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test event 2" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test event 1" })).toBeVisible();
  await page.getByTestId("delete-button").first().click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("heading", { name: "Test event 2" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test event 1" })).toBeVisible();
  await page.getByTestId("delete-button").first().click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("heading", { name: "Test event 1" })).toBeVisible();
});
