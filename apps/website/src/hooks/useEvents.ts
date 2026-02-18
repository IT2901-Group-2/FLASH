"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useEventsQuery() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });
}
