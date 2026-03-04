import { describe, expect, it } from "vitest";
import { parseAsJSON } from "./json";

describe("parseAsJSON", () => {
  it("Should handle primitives correctly", () => {
    expect(parseAsJSON(null)).toBe(null);
    expect(parseAsJSON(true)).toBe(true);
    expect(parseAsJSON(1)).toBe(1);
    expect(parseAsJSON("foo")).toBe("foo");
  });

  it("Should handle arrays correctly", () => {
    expect(parseAsJSON([])).toStrictEqual([]);
    expect(
      parseAsJSON([undefined, 1, true, null, undefined, "foo", undefined])
    ).toStrictEqual([1, true, null, "foo"]);
    expect(
      parseAsJSON([
        undefined,
        [1, undefined],
        ["foo", [[null, undefined, true]], undefined],
      ])
    ).toStrictEqual([[1], ["foo", [[null, true]]]]);
  });

  it("Should handle objects correctly", () => {
    expect(parseAsJSON({})).toStrictEqual({});
    expect(
      parseAsJSON({ a: 1, b: undefined, c: null, d: "foo", e: false })
    ).toStrictEqual({
      a: 1,
      c: null,
      d: "foo",
      e: false,
    });
    expect(parseAsJSON({ a: { a: { c: undefined }, b: 1 }, c: 2 })).toStrictEqual({
      a: { a: {}, b: 1 },
      c: 2,
    });
  });

  it("Shuold handle mixed arrays/objects correctly", () => {
    expect(parseAsJSON([{ a: [1, undefined, { b: undefined }] }])).toStrictEqual([
      { a: [1, {}] },
    ]);
    expect(parseAsJSON({ a: [null, undefined, { a: "foo" }] })).toStrictEqual({
      a: [null, { a: "foo" }],
    });
  });

  it("Should handle `toJSON` correctly", () => {
    const now = new Date();
    expect(parseAsJSON(now)).toBe(now.toJSON());

    class A {
      toJSON() {
        return "foo";
      }
    }
    expect(parseAsJSON(new A())).toBe("foo");

    class B {}
    expect(parseAsJSON(new B())).toBe("[object Object]");
  });
});
