import { describe, expect, it } from "vitest";
import useIsMobile from "../useIsMobile";
import { renderHook } from "@testing-library/react";

describe("useIsMobile", () => {
  it("should return true when window width is less than 768px", async () => {
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should return false when window width is greater than or equal to 768px", async () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
