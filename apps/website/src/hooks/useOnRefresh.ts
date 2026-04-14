import { usePathname, useSearchParams } from "next/navigation";
import { DependencyList, useEffect } from "react";

export function useOnRefresh(effect: () => void, deps: DependencyList = []): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(effect, [pathname, searchParams, ...deps]);
}
