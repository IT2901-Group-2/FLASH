import { useCallback, useRef, RefObject, RefCallback, Ref } from "react";

type ReactRef<T> = Ref<T> | RefObject<T> | RefCallback<T>;

/**
 * Assigns a value to a ref (object ref or callback ref).
 */
function assignRef<T>(ref: ReactRef<T> | null | undefined, value: T) {
  if (ref == null) return;

  if (typeof ref === "function") ref(value);
  else (ref as RefObject<T>).current = value;
}

/**
 * useMergeRefs
 *
 * Merges multiple refs into a single callback ref. Useful when a component
 * needs to forward a ref while also keeping a local ref.
 *
 * @example
 * const mergedRef = useMergeRefs(forwardedRef, localRef);
 * return <div ref={mergedRef} />;
 */
export function useMergeRefs<T>(
  ...refs: (ReactRef<T> | null | undefined)[]
): RefCallback<T> {
  // Keep refs in a stable ref so the callback identity only changes when
  // the refs themselves change (shallow comparison).
  const stableRefs = useRef(refs);
  stableRefs.current = refs;

  return useCallback((value: T) => {
    for (const ref of stableRefs.current) {
      assignRef(ref, value);
    }
  }, []);
}
