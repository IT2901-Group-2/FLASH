import { describe, expect, it } from "vitest";
import { parseJSON } from "./json";

describe("parseJSON", () => {
  it("Should handle primitives correctly", () => {
    expect(parseJSON(null)).toBe(null);
    expect(parseJSON(true)).toBe(true);
    expect(parseJSON(1)).toBe(1);
    expect(parseJSON("foo")).toBe("foo");
  });

  it("Should handle arrays correctly", () => {
    expect(parseJSON([])).toStrictEqual([]);
    expect(
      parseJSON([undefined, 1, true, null, undefined, "foo", undefined])
    ).toStrictEqual([1, true, null, "foo"]);
    expect(
      parseJSON([
        undefined,
        [1, undefined],
        ["foo", [[null, undefined, true]], undefined],
      ])
    ).toStrictEqual([[1], ["foo", [[null, true]]]]);
  });

  it("Should handle objects correctly", () => {
    expect(parseJSON({})).toStrictEqual({});
    expect(parseJSON({ a: 1, b: undefined, c: null, d: "foo", e: false })).toStrictEqual({
      a: 1,
      c: null,
      d: "foo",
      e: false,
    });
    expect(parseJSON({ a: { a: { c: undefined }, b: 1 }, c: 2 })).toStrictEqual({
      a: { a: {}, b: 1 },
      c: 2,
    });
  });

  it("Shuold handle mixed arrays/objects correctly", () => {
    expect(parseJSON([{ a: [1, undefined, { b: undefined }] }])).toStrictEqual([
      { a: [1, {}] },
    ]);
    expect(parseJSON({ a: [null, undefined, { a: "foo" }] })).toStrictEqual({
      a: [null, { a: "foo" }],
    });
  });

  it("Should handle `toJSON` correctly", () => {
    const now = new Date();
    expect(parseJSON(now)).toBe(now.toJSON());

    class A {
      toJSON() {
        return "foo";
      }
    }
    expect(parseJSON(new A())).toBe("foo");

    class B {}
    expect(parseJSON(new B())).toBe("[object Object]");
  });
});
