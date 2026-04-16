"use server";

import { PropsWithChildren } from "react";
import { EventAuth, EventAuthContextProvider } from "./EventAuthContext";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { JWT_SECRET } from "@/config";

export async function getEventAuth(eventId: string): Promise<EventAuth> {
  return getEventCookie(eventId, JWT_SECRET).fold(
    ({ name, isModerator, userId }) => ({
      isAuthenticated: true,
      nickname: name,
      isModerator,
      userId,
    }),
    () => ({
      isAuthenticated: false,
      nickname: undefined,
      isModerator: undefined,
    })
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
