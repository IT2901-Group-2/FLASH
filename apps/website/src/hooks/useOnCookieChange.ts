import { DependencyList, useEffect } from "react";

/**
 * Fires an effect when the `cookieStore` changes.
 *
 * @param effect The effect to fire.
 * @param deps A list of the effect's dependencies.
 */
export function useOnCookieChange(effect: () => void, deps: DependencyList = []): void {
  useEffect(() => {
    cookieStore.addEventListener("change", effect);
    return () => cookieStore.removeEventListener("change", effect);
  }, [cookieStore, ...deps]);
}
