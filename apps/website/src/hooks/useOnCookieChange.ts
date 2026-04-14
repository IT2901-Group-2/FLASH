import { DependencyList, useEffect } from "react";

export function useOnCookieChange(effect: () => void, deps: DependencyList = []): void {
  useEffect(() => {
    cookieStore.addEventListener("change", effect);
    return () => cookieStore.removeEventListener("change", effect);
  }, [cookieStore, ...deps]);
}
