import { describe, it, expect } from "vitest";
import { kebabCase, kebabCaseForAlpha } from "../src/utils/kebabCase";

describe("kebabCase", () => {
  it("converts camelCase to kebab-case", () => {
    expect(kebabCase("helloWorld")).toBe("hello-world");
  });

  it("converts PascalCase to kebab-case", () => {
    expect(kebabCase("HelloWorld")).toBe("hello-world");
  });

  it("converts spaces to hyphens", () => {
    expect(kebabCase("Hello World")).toBe("hello-world");
  });

  it("converts underscores to hyphens", () => {
    expect(kebabCase("foo_bar_baz")).toBe("foo-bar-baz");
  });

  it("handles consecutive capital letters", () => {
    expect(kebabCase("XMLParser")).toBe("xml-parser");
  });

  it("collapses multiple hyphens", () => {
    expect(kebabCase("hello--world")).toBe("hello-world");
  });

  it("removes leading and trailing hyphens", () => {
    expect(kebabCase("-helloWorld-")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(kebabCase("hello@world!")).toBe("helloworld");
  });

  it("handles mixed input", () => {
    expect(kebabCase("Hello_World 123")).toBe("hello-world-123");
  });

  it("returns empty string for empty input", () => {
    expect(kebabCase("")).toBe("");
  });
});

describe("kebabCaseForAlpha", () => {
  it("converts camelCase to kebab-case", () => {
    expect(kebabCaseForAlpha("myVarName")).toBe("my-var-name");
  });

  it("strips digits from input", () => {
    expect(kebabCaseForAlpha("hello World 123")).toBe("hello-world");
  });

  it("handles digits within camelCase", () => {
    expect(kebabCaseForAlpha("myVar1Name")).toBe("my-var-name");
  });

  it("converts underscores with digits", () => {
    expect(kebabCaseForAlpha("foo_bar2baz")).toBe("foo-bar-baz");
  });

  it("removes special characters", () => {
    expect(kebabCaseForAlpha("hello@world!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(kebabCaseForAlpha("hello--world")).toBe("hello-world");
  });

  it("returns empty string for empty input", () => {
    expect(kebabCaseForAlpha("")).toBe("");
  });

  it("handles input with only digits", () => {
    expect(kebabCaseForAlpha("12345")).toBe("");
  });
});
