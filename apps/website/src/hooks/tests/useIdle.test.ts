import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIdle } from "../useIdle";

describe("useIdle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts as not idle", () => {
    const { result } = renderHook(() => useIdle(2000));
    expect(result.current).toBe(false);
  });

  it("becomes idle after the delay", () => {
    const { result } = renderHook(() => useIdle(2000));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(true);
  });

  it("does not become idle before the delay", () => {
    const { result } = renderHook(() => useIdle(2000));
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current).toBe(false);
  });

  it.each(["mousemove", "mousedown", "keydown"])('resets idle on "%s"', event => {
    const { result } = renderHook(() => useIdle(2000));

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    act(() => {
      window.dispatchEvent(new Event(event));
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);
  });

  it("resets from idle back to active on user input", () => {
    const { result } = renderHook(() => useIdle(2000));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });
    expect(result.current).toBe(false);
  });

  it("uses the default delay of 2000ms", () => {
    const { result } = renderHook(() => useIdle());

    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("respects a custom delay", () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("removes event listeners and clears timer on unmount", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const clearTimeout = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useIdle(2000));
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("mousedown", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(clearTimeout).toHaveBeenCalled();
  });

  it("restarts with the new delay when delay changes", () => {
    const { result, rerender } = renderHook(({ delay }) => useIdle(delay), {
      initialProps: { delay: 2000 },
    });

    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current).toBe(false);

    rerender({ delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);
  });
});
