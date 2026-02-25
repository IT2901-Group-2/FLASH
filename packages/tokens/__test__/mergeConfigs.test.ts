import { describe, it, expect } from "vitest";
import { mergeConfigs, StyleDictionaryTokenConfig } from "../src/tokens.utils";

describe("mergeConfigs", () => {
  it("returns an empty object when given an empty array", () => {
    expect(mergeConfigs([])).toEqual({});
  });

  it("returns the config unchanged when given a single config", () => {
    const config: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "#000", type: "color" } },
    };
    expect(mergeConfigs([config])).toEqual(config);
  });

  it("merges two configs with distinct keys", () => {
    const a: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "#000", type: "color" } },
    };
    const b: StyleDictionaryTokenConfig<"global-breakpoint"> = {
      spacing: { small: { value: "768px", type: "global-breakpoint" } },
    };
    expect(mergeConfigs([a, b])).toEqual({ ...a, ...b });
  });

  it("deeply merges nested keys rather than overwriting the parent", () => {
    const a: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "#000", type: "color" } },
    };
    const b: StyleDictionaryTokenConfig<"color"> = {
      color: { secondary: { value: "#fff", type: "color" } },
    };
    expect(mergeConfigs([a, b])).toEqual({
      color: {
        primary: { value: "#000", type: "color" },
        secondary: { value: "#fff", type: "color" },
      },
    });
  });

  it("later configs overwrite earlier configs for the same key", () => {
    const a: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "#000", type: "color" } },
    };
    const b: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "red", type: "color" } },
    };
    expect(mergeConfigs([a, b])).toEqual({
      color: { primary: { value: "red", type: "color" } },
    });
  });

  it("merges more than two configs in order", () => {
    const a: StyleDictionaryTokenConfig<"color"> = {
      color: { primary: { value: "#000", type: "color" } },
    };
    const b: StyleDictionaryTokenConfig<"color"> = {
      color: { secondary: { value: "#fff", type: "color" } },
    };
    const c: StyleDictionaryTokenConfig<"global-breakpoint"> = {
      spacing: { small: { value: "768px", type: "global-breakpoint" } },
    };
    expect(mergeConfigs([a, b, c])).toEqual({
      color: {
        primary: { value: "#000", type: "color" },
        secondary: { value: "#fff", type: "color" },
      },
      spacing: { small: { value: "768px", type: "global-breakpoint" } },
    });
  });
});
