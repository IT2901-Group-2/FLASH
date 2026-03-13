import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the user has been idle for a given duration.
 * Resets on `mousemove`, `mousedown`, or `keydown` events.
 *
 * @param delay - Time in milliseconds before the user is considered idle. Defaults to `2000`.
 * @returns `true` when the user has been inactive for the given delay, `false` otherwise.
 *
 * @example
 * const isIdle = useIdle(3000);
 *
 * return <Overlay visible={isIdle} />;
 */
export const useIdle = (delay = 2000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsIdle(true), delay);
    };

    const events = ["mousemove", "mousedown", "keydown"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [delay]);

  return isIdle;
};
