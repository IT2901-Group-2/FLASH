import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cycles through indices at a fixed interval, with support for manual navigation.
 *
 * @param length - The number of items to cycle through.
 * @param interval - The time in milliseconds between each step. Defaults to `5000`.
 * @returns A tuple of:
 * - The current index.
 * - A setter function that accepts a number or updater function, and resets the interval on use.
 * - A controls object with `paused` state and `pause`, `resume`, and `toggle` functions.
 * Negative indices and out-of-bounds values are wrapped automatically.
 *
 * @example
 * const [index, setIndex, { paused, toggle }] = useInterval(images.length, 3000);
 *
 * const next = () => setIndex(i => i + 1);
 * const prev = () => setIndex(i => i - 1);
 *
 * return <button onClick={toggle}>{paused ? "Play" : "Pause"}</button>;
 */
export const useInterval = (length: number, interval = 5000) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const pausedRef = useRef(false);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    if (!length || pausedRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % length);
    }, interval);
  }, [length, interval]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  const set = useCallback(
    (updater: number | ((i: number) => number)) => {
      setIndex(i => {
        const next = typeof updater === "function" ? updater(i) : updater;
        const index = ((next % length) + length) % length;
        if (isNaN(index)) return 0;
        return index;
      });
      startInterval();
    },
    [length, startInterval]
  );

  const pause = useCallback(() => {
    pausedRef.current = true;
    setPaused(true);
    clearInterval(intervalRef.current);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    startInterval();
  }, [startInterval]);

  const toggle = useCallback(() => {
    if (pausedRef.current) resume();
    else pause();
  }, [pause, resume]);

  return [index, set, { paused, pause, resume, toggle }] as const;
};
