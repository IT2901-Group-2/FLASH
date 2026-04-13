"use client";

import { EventCookie } from "@/db";
import { ComponentProps, createContext, use, useContext } from "react";

export const JoinedEventsContext = createContext<Promise<
  Omit<EventCookie, "userId">[]
> | null>(null);

export const JoinedEventsContextProvider = (
  props: ComponentProps<typeof JoinedEventsContext.Provider>
) => <JoinedEventsContext.Provider {...props} />;

export function useJoinedEvents(): Omit<EventCookie, "userId">[] {
  const joinedEvents = useContext(JoinedEventsContext);
  if (joinedEvents === null) {
    throw new Error("useJoinedEvents has to be used within a JoinedEventsProvider");
  }
  return use(joinedEvents);
}
