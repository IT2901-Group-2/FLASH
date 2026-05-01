import { test as base } from "@playwright/test";

type NavigationFixture = {
  /**
   * Attempts to join an event using the given event code and nickname.
   * Must be used while on the root page (`/[locale]`).
   */
  joinEvent: (code: string, nickname: string) => Promise<void>;

  /**
   * Attempts to log in as an administrator using the given password.
   * Must be used while on the root page (`/[locale]`).
   */
  login: (password?: string) => Promise<void>;
};

export const test = base.extend<NavigationFixture>({
  joinEvent: ({ page }, _use) =>
    _use(async (code, nickname) => {
      await page.getByRole("textbox", { name: "Event Code" }).click();
      await page.getByRole("textbox", { name: "Event Code" }).fill(code);
      await page.getByRole("button", { name: "Join Event" }).click();
      await page.waitForURL("**/join/*");

      await page.getByRole("textbox", { name: "Nickname" }).click();
      await page.getByRole("textbox", { name: "Nickname" }).fill(nickname);
      await page.getByRole("button", { name: "Join Event" }).click();
      await page.waitForURL("**/events/*");
    }),

  login: ({ page }, _use) =>
    _use(async (password = "Default") => {
      await page.getByRole("link", { name: "Admin" }).click();
      await page.waitForURL("**/admin");

      await page.getByRole("textbox", { name: "Password" }).click();
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL("**/admin/dashboard");
    }),
});

export { expect } from "@playwright/test";
