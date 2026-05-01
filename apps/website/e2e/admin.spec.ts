import { test, expect } from "./fixtures";

test("Admin dashboard test", async ({ page, appUrl, login }) => {
  test.skip(); // FIXME: Fails in CI/CD
  await page.goto(`${appUrl}/en`);

  await login();
  await expect(page.locator("section")).toMatchAriaSnapshot(`
    - heading "Events" [level=2]
    - paragraph: Manage your events
    - button "Create New Event"
    - text: Search
    - textbox "Search"
    - text: Status
    - combobox "Status"
    - text: Sort
    - combobox "Sort": Name
    - button
    - heading "Test event 3" [level=2]
    - text: /Apr \\d+, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 2 Pending 0 No photo limit/
    - button
    - button
    - heading "Test event 2" [level=2]
    - text: /May 1, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 0 Pending 1 No photo limit/
    - button
    - button
    - heading "Test event 1" [level=2]
    - text: /May 1, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 2 Pending 0 1 photo per person/
    - button
    - button
    `);
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Active" }).click();
  await expect(page.locator("section")).toMatchAriaSnapshot(`
    - heading "Events" [level=2]
    - paragraph: Manage your events
    - button "Create New Event"
    - text: Search
    - textbox "Search"
    - text: Status
    - combobox "Status": Active
    - text: Sort
    - combobox "Sort": Name
    - button
    - heading "Test event 2" [level=2]
    - text: /May 1, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 0 Pending 1 No photo limit/
    - button
    - button
    - heading "Test event 1" [level=2]
    - text: /May 1, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 2 Pending 0 1 photo per person/
    - button
    - button
    `);
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Finished" }).click();
  await expect(page.locator("section")).toMatchAriaSnapshot(`
    - heading "Events" [level=2]
    - paragraph: Manage your events
    - button "Create New Event"
    - text: Search
    - textbox "Search"
    - text: Status
    - combobox "Status": Finished
    - text: Sort
    - combobox "Sort": Name
    - button
    - heading "Test event 3" [level=2]
    - text: /Apr \\d+, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 2 Pending 0 No photo limit/
    - button
    - button
    `);
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "All" }).click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("2");
  await expect(page.locator("section")).toMatchAriaSnapshot(`
    - heading "Events" [level=2]
    - paragraph: Manage your events
    - button "Create New Event"
    - text: Search
    - textbox "Search"
    - text: Status
    - combobox "Status"
    - text: Sort
    - combobox "Sort": Name
    - button
    - heading "Test event 2" [level=2]
    - text: /May 1, \\d+, \\d+:\\d+ AM Total Photos 2 Approved 0 Pending 1 No photo limit/
    - button
    - button
    `);
});

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
