import { test, expect } from "./fixtures";

test("Admin dashboard test", async ({ page, appUrl }) => {
  await page.goto(`${appUrl}/en`);
  await page.getByRole("link", { name: "Admin" }).click();
  await page.waitForURL("**/admin");

  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("Default");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin/dashboard");

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
