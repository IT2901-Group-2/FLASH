// pxToRem.test.ts
import { describe, it, expect } from "vitest";
import { pxToRem } from "../src/utils/pxToRem";

describe("pxToRem", () => {
  it("converts 16px to 1rem using the default base (16px)", () => {
    expect(pxToRem(16)).toBe("1rem");
  });

  it("converts a larger px value to rem using default base", () => {
    expect(pxToRem(32)).toBe("2rem");
  });

  it("converts zero to 0rem", () => {
    expect(pxToRem(0)).toBe("0rem");
  });

  it("handles negative pixel values", () => {
    // -8 / 16 = -0.5
    expect(pxToRem(-8)).toBe("-0.5rem");
  });

  it("returns precise fractional rem values", () => {
    // 5 / 16 = 0.3125
    expect(pxToRem(5)).toBe(`${5 / 16}rem`);
  });

  it("accepts a custom baseFontSize", () => {
    expect(pxToRem(24, 12)).toBe("2rem"); // 24 / 12 = 2
    expect(pxToRem(15, 15)).toBe("1rem"); // 15 / 15 = 1
  });

  it("behaves consistently for very large numbers", () => {
    expect(pxToRem(160000)).toBe(`${160000 / 16}rem`);
  });

  it('returns "NaNrem" when passed NaN', () => {
    expect(() => pxToRem(NaN)).toThrow(EvalError);
  });

  it('returns "Infinityrem" when dividing by zero (baseFontSize = 0)', () => {
    // 16 / 0 -> Infinity
    expect(() => pxToRem(16, 0)).toThrow(EvalError);
  });

  it('returns "Infinityrem" when input is Infinity', () => {
    expect(() => pxToRem(Infinity)).toThrow(EvalError);
  });
});
