let refreshFn: (() => Promise<unknown>) | null = null;

export function registerRefresh(fn: () => Promise<unknown>) {
  refreshFn = fn;
}

export function getRefresh() {
  return refreshFn;
}
