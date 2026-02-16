import { describe, expect, it } from "vitest";
import { capitalize, generateRandomString } from "./string-utils";

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

describe("generateRandomString", () => {
  it("should return a string of the specified length", () => {
    expect(generateRandomString(10)).toHaveLength(10);
    expect(generateRandomString(5)).toHaveLength(5);
    expect(generateRandomString(100)).toHaveLength(100);
  });

  it("should return an empty string when length is 0", () => {
    expect(generateRandomString(0)).toBe("");
  });

  it("should only contain alphabetic characters (a-z, A-Z)", () => {
    const result = generateRandomString(1000);
    expect(/^[a-zA-Z]+$/.test(result)).toBe(true);
  });

  it("should generate different strings on subsequent calls", () => {
    const result1 = generateRandomString(50);
    const result2 = generateRandomString(50);
    const result3 = generateRandomString(50);

    // While theoretically possible to get the same string, it's extremely unlikely
    expect(result1).not.toBe(result2);
    expect(result2).not.toBe(result3);
    expect(result1).not.toBe(result3);
  });

  it("should handle negative length gracefully", () => {
    const result = generateRandomString(-5);
    expect(result).toBe("");
  });
});
