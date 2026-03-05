"use server";

import { PropsWithChildren } from "react";
import { EventAuth, EventAuthContextProvider } from "./EventAuthContext";
import { getEventCookie } from "@/lib/utils/eventCookie";

export async function getEventAuth(eventId: string): Promise<EventAuth> {
  return getEventCookie(eventId).fold(
    ({ name, isModerator }) => ({
      isAuthenticated: true,
      nickname: name,
      isModerator,
    }),
    () => ({ isAuthenticated: false, nickname: undefined, isModerator: undefined })
  );
}

export async function EventAuthProvider({
  eventId,
  children,
}: PropsWithChildren<{ eventId: string }>) {
  const eventAuthPromise = getEventAuth(eventId);

  return (
    <EventAuthContextProvider value={eventAuthPromise}>
      {children}
    </EventAuthContextProvider>
  );
}
