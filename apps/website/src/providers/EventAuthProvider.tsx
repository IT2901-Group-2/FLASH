"use client";

import { PropsWithChildren } from "react";
import { createContext, use, useContext } from "react";

export type EventAuth =
  | {
      isAuthenticated: false;
      nickname: undefined;
      isModerator: undefined;
    }
  | {
      isAuthenticated: true;
      nickname: string;
      isModerator: boolean;
    };

export const EventAuthContext = createContext<Promise<EventAuth> | null>(null);

export function EventAuthProvider({
  eventAuthPromise,
  children,
}: PropsWithChildren<{ eventAuthPromise: Promise<EventAuth> }>) {
  return (
    <EventAuthContext.Provider value={eventAuthPromise}>
      {children}
    </EventAuthContext.Provider>
  );
}

export function useEventAuth(): EventAuth {
  const eventAuth = useContext(EventAuthContext);
  if (eventAuth === null) {
    throw new Error("useEventAuth has to be used within an EventAuthProvider");
  }

  return use(eventAuth);
}
