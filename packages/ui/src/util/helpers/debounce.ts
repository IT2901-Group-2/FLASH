"use client";

type Debounced<T extends unknown[]> = ((...args: T) => void) & { clear: () => void };

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
