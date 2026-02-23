import { describe, it, expect } from "vitest";
import { merge } from "../src/utils/merge";

describe("merge", () => {
  it("should merge simple objects", () => {
    const object = { a: 1, b: 2 };
    const result = merge(object, { c: 3 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should overwrite values with source values", () => {
    const object = { a: 1, b: 2 };
    const result = merge(object, { b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("should ignore undefined values in source", () => {
    const object = { a: 1, b: 2 };
    const result = merge(object, { b: undefined });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should concatenate arrays", () => {
    const object = { arr: [1, 2] };
    const result = merge(object, { arr: [3, 4] });
    expect(result).toEqual({ arr: [1, 2, 3, 4] });
  });

  it("should merge nested objects recursively", () => {
    const object = { nested: { a: 1, b: 2 } };
    const result = merge(object, { nested: { b: 3, c: 4 } });
    expect(result).toEqual({ nested: { a: 1, b: 3, c: 4 } });
  });

  it("should ignore empty source objects", () => {
    const object = { a: 1 };
    const result = merge(object, {}, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should replace non-object values with object values", () => {
    const object = { a: 1 };
    const result = merge(object, { a: { nested: true } });
    expect(result).toEqual({ a: { nested: true } });
  });

  it("should handle deeply nested objects", () => {
    const object = { a: { b: { c: 1 } } };
    const result = merge(object, { a: { b: { d: 2 } } });
    expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  it("should return the modified object", () => {
    const object = { a: 1 };
    const result = merge(object, { b: 2 });
    expect(result).toBe(object);
  });
});
