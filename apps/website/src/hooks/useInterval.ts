import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cycles through indices at a fixed interval, with support for manual navigation.
 *
 * @param length - The number of items to cycle through.
 * @param interval - The time in milliseconds between each step. Defaults to `5000`.
 * @returns A tuple of the current index and a setter function. The setter accepts
 * either a number or an updater function, and resets the interval on manual change.
 * Negative indices and out-of-bounds values are wrapped automatically.
 *
 * @example
 * const [index, setIndex] = useInterval(images.length, 3000);
 *
 * const next = () => setIndex(i => i + 1);
 * const prev = () => setIndex(i => i - 1);
 */
export const useInterval = (length: number, interval = 5000) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    if (!length) return;
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
        return ((next % length) + length) % length; // handles negative wrapping
      });
      startInterval();
    },
    [length, startInterval]
  );

  return [index, set] as const;
};
