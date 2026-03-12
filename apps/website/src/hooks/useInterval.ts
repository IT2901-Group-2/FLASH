import { useCallback, useEffect, useRef, useState } from "react";

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
