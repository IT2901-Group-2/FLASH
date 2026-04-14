import { usePathname, useSearchParams } from "next/navigation";
import { DependencyList, useEffect } from "react";

/**
 * Fires an effect when the URL changes.
 * Useful for state updates on in-app navigation.
 *
 * @param effect The effect to fire.
 * @param deps A list of the effect's dependencies.
 */
export function useOnRefresh(effect: () => void, deps: DependencyList = []): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(effect, [pathname, searchParams, ...deps]);
}
