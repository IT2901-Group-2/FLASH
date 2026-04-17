import { useSyncExternalStore } from "react";

/**
 * A hook that returns `true` if the component is currently mounted, and `false` otherwise.
 * This can be used to avoid setting state on an unmounted component.
 *
 * @returns `true` if the component is mounted, `false` otherwise
 *
 * @example
 * const MyComponent = () => {
 *   const isMounted = useIsMounted();
 *   useEffect(() => {
 *     fetchData().then(data => {
 *       if (isMounted) setData(data);
 *    });
 *  });
 */
export function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
