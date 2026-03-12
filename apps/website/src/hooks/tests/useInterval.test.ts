import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInterval } from "../useInterval";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("auto-advance", () => {
    it("starts at index 0", () => {
      const { result } = renderHook(() => useInterval(5));
      expect(result.current[0]).toBe(0);
    });

    it("advances the index after each interval", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current[0]).toBe(1);

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current[0]).toBe(2);
    });

    it("wraps around to 0 after the last index", () => {
      const { result } = renderHook(() => useInterval(3, 1000));

      act(() => vi.advanceTimersByTime(3000));
      expect(result.current[0]).toBe(0);
    });

    it("does not advance before the interval elapses", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => vi.advanceTimersByTime(999));
      expect(result.current[0]).toBe(0);
    });

    it("uses the default interval of 5000ms", () => {
      const { result } = renderHook(() => useInterval(5));

      act(() => vi.advanceTimersByTime(4999));
      expect(result.current[0]).toBe(0);

      act(() => vi.advanceTimersByTime(1));
      expect(result.current[0]).toBe(1);
    });

    it("does not start the interval when length is 0", () => {
      const { result } = renderHook(() => useInterval(0, 1000));

      act(() => vi.advanceTimersByTime(5000));
      expect(result.current[0]).toBe(0);
    });

    it("clears the interval on unmount", () => {
      const clearInterval = vi.spyOn(globalThis, "clearInterval");
      const { unmount } = renderHook(() => useInterval(5, 1000));

      unmount();
      expect(clearInterval).toHaveBeenCalled();
    });

    it("restarts with the new interval when props change", () => {
      const { result, rerender } = renderHook(
        ({ length, interval }) => useInterval(length, interval),
        { initialProps: { length: 5, interval: 1000 } }
      );

      act(() => vi.advanceTimersByTime(500));
      rerender({ length: 5, interval: 2000 });

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current[0]).toBe(0);

      act(() => vi.advanceTimersByTime(1000));
      expect(result.current[0]).toBe(1);
    });
  });

  describe("set", () => {
    it("sets index to an exact number", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[1](3));
      expect(result.current[0]).toBe(3);
    });

    it("accepts an updater function", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[1](i => i + 2));
      expect(result.current[0]).toBe(2);
    });

    it("wraps positive out-of-bounds values", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[1](7));
      expect(result.current[0]).toBe(2);
    });

    it("wraps negative values", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[1](-1));
      expect(result.current[0]).toBe(4);
    });

    it("resets the interval timer on manual set", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => vi.advanceTimersByTime(800));
      act(() => result.current[1](2));
      act(() => vi.advanceTimersByTime(800));

      expect(result.current[0]).toBe(2);

      act(() => vi.advanceTimersByTime(200));
      expect(result.current[0]).toBe(3);
    });
  });

  describe("pause", () => {
    it("starts unpaused", () => {
      const { result } = renderHook(() => useInterval(5, 1000));
      expect(result.current[2].paused).toBe(false);
    });

    it("stops auto-advancing when paused", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].pause());
      act(() => vi.advanceTimersByTime(5000));

      expect(result.current[0]).toBe(0);
    });

    it("sets paused to true", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].pause());
      expect(result.current[2].paused).toBe(true);
    });
  });

  describe("resume", () => {
    it("resumes auto-advancing after pause", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].pause());
      act(() => vi.advanceTimersByTime(3000));
      act(() => result.current[2].resume());
      act(() => vi.advanceTimersByTime(1000));

      expect(result.current[0]).toBe(1);
    });

    it("sets paused to false", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].pause());
      act(() => result.current[2].resume());
      expect(result.current[2].paused).toBe(false);
    });

    it("restarts the interval from zero on resume", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].pause());
      act(() => result.current[2].resume());
      act(() => vi.advanceTimersByTime(999));

      expect(result.current[0]).toBe(0);

      act(() => vi.advanceTimersByTime(1));
      expect(result.current[0]).toBe(1);
    });
  });

  describe("toggle", () => {
    it("pauses when running", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].toggle());
      expect(result.current[2].paused).toBe(true);
    });

    it("resumes when paused", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].toggle());
      act(() => result.current[2].toggle());
      expect(result.current[2].paused).toBe(false);
    });

    it("stops advancing after toggle-pause and advances after toggle-resume", () => {
      const { result } = renderHook(() => useInterval(5, 1000));

      act(() => result.current[2].toggle());
      act(() => vi.advanceTimersByTime(3000));
      expect(result.current[0]).toBe(0);

      act(() => result.current[2].toggle());
      act(() => vi.advanceTimersByTime(1000));
      expect(result.current[0]).toBe(1);
    });
  });
});
