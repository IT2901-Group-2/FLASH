"use client";

type Debounced<T extends unknown[]> = ((...args: T) => void) & { clear: () => void };

/**
 * Creates a debounced function that delays invoking the provided function
 * until after a specified wait time has elapsed since the last time the
 * debounced function was invoked.
 *
 * Optionally, the function can be invoked immediately on the leading edge
 * of the timeout instead of the trailing edge.
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay before invoking the function after the last call.
 * @param leading If true, the function will be invoked on the leading edge of the timeout instead of the trailing edge.
 * @returns A debounced version of the provided function.
 */
function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
  leading = false
): Debounced<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: T) {
    const shouldCallImmediately = leading && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = undefined;
      if (!leading) func(...args);
    }, wait);

    if (shouldCallImmediately) func(...args);
  } as Debounced<T>;

  debounced.clear = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
}

export { debounce };
