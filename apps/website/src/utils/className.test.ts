import { describe, expect, it } from "vitest";
import { cl } from "./className";

describe("cl (className)", () => {
  describe("basic primitives", () => {
    it("returns empty string for no arguments", () => {
      expect(cl()).toBe("");
    });

    it("returns a single string class", () => {
      expect(cl("foo")).toBe("foo");
    });

    it("joins multiple string classes with spaces", () => {
      expect(cl("foo", "bar", "baz")).toBe("foo bar baz");
    });

    it("returns a number as a string", () => {
      expect(cl(1)).toBe("1");
      expect(cl(0)).toBe("");
    });
  });

  describe("falsy values behaviour", () => {
    it("ignores null", () => {
      expect(cl(null)).toBe("");
    });

    it("ignores undefined", () => {
      expect(cl(undefined)).toBe("");
    });

    it("ignores false", () => {
      expect(cl(false)).toBe("");
    });

    it("ignores true", () => {
      expect(cl(true)).toBe("");
    });

    it("ignores 0", () => {
      expect(cl(0)).toBe("");
    });

    it("skips falsy values between truthy ones", () => {
      expect(cl("foo", null, "bar", undefined, "baz")).toBe("foo bar baz");
      expect(cl("foo", false, "bar")).toBe("foo bar");
    });
  });

  describe("object inputs", () => {
    it("includes keys with truthy values", () => {
      expect(cl({ foo: true, bar: true })).toBe("foo bar");
    });

    it("excludes keys with falsy values", () => {
      expect(cl({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("handles all-falsy object", () => {
      expect(cl({ foo: false, bar: null, baz: 0 })).toBe("");
    });

    it("handles empty object", () => {
      expect(cl({})).toBe("");
    });

    it("works with mixed string and object inputs", () => {
      expect(cl("base", { active: true, disabled: false })).toBe("base active");
    });
  });

  describe("array inputs", () => {
    it("processes elements of a flat array", () => {
      expect(cl(["foo", "bar"])).toBe("foo bar");
    });

    it("handles nested arrays", () => {
      expect(cl(["foo", ["bar", "baz"]])).toBe("foo bar baz");
    });

    it("ignores falsy values inside arrays", () => {
      expect(cl(["foo", null, undefined, false, "bar"])).toBe("foo bar");
    });

    it("handles arrays with objects", () => {
      expect(cl(["foo", { bar: true, baz: false }])).toBe("foo bar");
    });

    it("handles deeply nested arrays", () => {
      expect(cl(["a", ["b", ["c", ["d"]]]])).toBe("a b c d");
    });

    it("handles empty array", () => {
      expect(cl([])).toBe("");
    });
  });

  describe("complex combinations", () => {
    it("combines strings, objects, and arrays", () => {
      expect(cl("btn", { "btn-primary": true, "btn-lg": false }, ["extra"])).toBe(
        "btn btn-primary extra"
      );
    });

    it("handles conditional class toggling", () => {
      const isActive = true;
      const isDisabled = false;
      expect(cl("item", { active: isActive, disabled: isDisabled })).toBe("item active");
    });

    it("handles multiple objects", () => {
      expect(cl({ foo: true }, { bar: true }, { baz: false })).toBe("foo bar");
    });

    it("deduplicates nothing - duplicate classes are kept", () => {
      expect(cl("foo", "foo")).toBe("foo foo");
    });

    it("handles a mix of all falsy input types", () => {
      expect(cl(null, undefined, false, 0, "", [])).toBe("");
    });
  });
});
