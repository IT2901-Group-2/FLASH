import { describe, it, expect } from "@jest/globals";
import { absolutePath, dirPath, resolvePath } from "./utils";

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

describe("absolutePath", () => {
  it("Should return the correct path", () => {
    expect(absolutePath("/")).toBe("/");
    expect(absolutePath("")).toBe("/");
    expect(absolutePath(".")).toBe("/");
    expect(absolutePath("/foo/bar")).toBe("/foo/bar");
    expect(absolutePath("/foo/bar/")).toBe("/foo/bar");
    expect(absolutePath("foo/bar/../baz")).toBe("/foo/baz");
    expect(absolutePath("../../foo")).toBe("/foo");
  });
});

describe("dirPath", () => {
  it("Should return the correct path", () => {
    expect(dirPath("/")).toBe("/");
    expect(dirPath("/foo/bar")).toBe("/foo/bar/");
    expect(dirPath("/foo/bar/")).toBe("/foo/bar/");
    expect(dirPath("foo/bar/../baz")).toBe("foo/bar/../baz/");
    expect(dirPath("../../foo")).toBe("../../foo/");
  });
});
