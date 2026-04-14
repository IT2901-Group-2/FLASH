import { getJoinedEvents } from "@/actions/joinedEvents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOnRefresh } from "./useOnRefresh";
import { useOnCookieChange } from "./useOnCookieChange";
import { useCallback } from "react";

const joinedEventsKeys = {
  all: ["joinedEvents"] as const,
} as const;

export function useJoinedEvents() {
  const queryClient = useQueryClient();

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: joinedEventsKeys.all });
  }, [queryClient, joinedEventsKeys.all]);

  useOnRefresh(invalidateQuery);
  useOnCookieChange(invalidateQuery);

  return useQuery({
    queryKey: joinedEventsKeys.all,
    queryFn: getJoinedEvents,
  });
}
