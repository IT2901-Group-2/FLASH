"use server";

import { PropsWithChildren } from "react";
import { JoinedEventsContextProvider } from "./JoinedEventsContext";
import { getEventCookies } from "@/lib/utils/eventCookie";

export async function getJoinedEvents(): Promise<string[]> {
  return getEventCookies()
    .map(cookies => cookies.map(cookie => cookie.eventId))
    .getOrDefault([]);
}

export async function JoinedEventsProvider({ children }: PropsWithChildren) {
  const joinedEventsPromise = getJoinedEvents();

  return (
    <JoinedEventsContextProvider value={joinedEventsPromise}>
      {children}
    </JoinedEventsContextProvider>
  );
}
