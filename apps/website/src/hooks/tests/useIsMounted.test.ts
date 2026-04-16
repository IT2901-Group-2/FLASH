import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useIsMounted } from "../useIsMounted";

describe("useIsMounted", () => {
  it("should return true on the client", () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });

  it("should stay true through re-renders", () => {
    const { result, rerender } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
    rerender();
    expect(result.current).toBe(true);
  });

  it("should return false ...", ({ skip }) => {
    // No good ways to test the server-side behavior of this hook
    skip();
  });
});
