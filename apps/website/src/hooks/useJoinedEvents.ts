import { getJoinedEvents } from "@/actions/joinedEvents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const joinedEventsKeys = {
  all: ["joinedEvents"] as const,
} as const;

/**
 * Fetches a list of all currently joined events.
 * Event cookies are accessed on the server.
 */
export function useJoinedEvents() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: joinedEventsKeys.all });
  }, [queryClient]);

  // Refetch on URL change
  useEffect(invalidateQuery, [pathname, searchParams, invalidateQuery]);

  // Refetch on `cookieStore` change
  useEffect(() => {
    cookieStore.addEventListener("change", invalidateQuery);
    return () => cookieStore.removeEventListener("change", invalidateQuery);
  }, [invalidateQuery]);

  return useQuery({
    queryKey: joinedEventsKeys.all,
    queryFn: getJoinedEvents,
  });
}
