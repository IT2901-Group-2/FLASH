import { describe, expect, it } from "vitest";
import { getFirstRow } from "./sql";
import { Result } from "typescript-result";

describe("getFirstRow", () => {
  it("Should return the first row", () => {
    expect(getFirstRow([1, 2, 3]).getOrThrow()).toBe(1);
  });

  it("Should return Err with correct message", () => {
    const res = getFirstRow([], "message");
    Result.assertError(res);
    expect(res.error.message).toBe("message");
  });
});
