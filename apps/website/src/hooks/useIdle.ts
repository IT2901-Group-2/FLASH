import { useEffect, useRef, useState } from "react";

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
