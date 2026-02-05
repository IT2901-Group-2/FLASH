import { describe, it, expect } from "@jest/globals";
import { resolvePath } from "./utils";

describe("resolvePath", () => {
  it("Should return the correct path", () => {
    expect(resolvePath("/")).toBe("/");
    expect(resolvePath("")).toBe("/");
    expect(resolvePath(".")).toBe("/");
    expect(resolvePath("/foo/bar")).toBe("foo/bar");
    expect(resolvePath("/foo/bar/")).toBe("foo/bar");
    expect(resolvePath("foo/bar/../baz")).toBe("foo/baz");
    expect(resolvePath("../../foo")).toBe("foo");
  });
});
