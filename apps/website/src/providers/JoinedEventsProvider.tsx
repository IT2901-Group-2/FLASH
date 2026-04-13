"use server";

import { PropsWithChildren } from "react";
import { JoinedEventsContextProvider } from "./JoinedEventsContext";
import { getEventCookies } from "@/lib/utils/eventCookie";
import { JWT_SECRET } from "@/config";
import { EventCookie } from "@/db";

export async function getJoinedEvents(): Promise<Omit<EventCookie, "userId">[]> {
  return getEventCookies(JWT_SECRET)
    .map(cookies => cookies.map(({ userId: _, ...rest }) => rest))
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
