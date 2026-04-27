import test, { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const coverage = await page.coverage.stopJSCoverage();
    await testInfo.attach("coverage", {
      body: JSON.stringify(coverage),
      contentType: "application/json",
    });
  });
}

export default globalSetup;
