import { useEffect, useState } from "react";

/**
 * Tracks whether the viewport width is less than 768px, indicating a mobile device.
 * Updates on window resize.
 *
 * @returns `true` if the viewport width is less than 768px, `false` otherwise.
 *
 * @example
 * const isMobile = useIsMobile();
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
