import { describe, expect, it } from "vitest";
import { capitalize } from "./string-utils";

describe("capitalize", () => {
  it("should capitalize the first letter of a lowercase string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should keep an already capitalized string unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("should capitalize first letter and keep the rest unchanged", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("should handle strings starting with a number", () => {
    expect(capitalize("123abc")).toBe("123abc");
  });

  it("should handle strings starting with special characters", () => {
    expect(capitalize("!hello")).toBe("!hello");
  });

  it("should handle strings with mixed case", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });

  it("should handle strings with leading spaces", () => {
    expect(capitalize(" hello")).toBe(" hello");
  });
});
