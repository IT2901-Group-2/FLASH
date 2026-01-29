import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} **/
export default {
  ...createDefaultPreset(),
  testEnvironment: "node",
  collectCoverage: true,
};
