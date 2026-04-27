import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { RefObject, useEffect, useRef } from "react";

export function useLoadMore({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteQueryResult): RefObject<HTMLDivElement | null> {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto-fetch the next page when the user scrolls near the end of the current list.
  useEffect(() => {
    if (hasNextPage !== true) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        void fetchNextPage();
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return loadMoreRef;
}
