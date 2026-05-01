/**
 * This file is used by the app fixture (`app.ts`) to inject a fake date into
 * the NextJS server while running E2E tests.
 */

import MockDate from "mockdate";

if (process.env.MOCK_DATE !== undefined) {
  MockDate.set(process.env.MOCK_DATE);
}
