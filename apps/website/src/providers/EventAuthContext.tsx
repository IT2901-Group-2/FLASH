"use client";

import { ComponentProps } from "react";
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
      userId: string;
    };

export const EventAuthContext = createContext<Promise<EventAuth> | null>(null);

export const EventAuthContextProvider = (
  props: ComponentProps<typeof EventAuthContext.Provider>
) => <EventAuthContext.Provider {...props} />;

export function useEventAuth(): EventAuth {
  const eventAuth = useContext(EventAuthContext);
  if (eventAuth === null) {
    throw new Error("useEventAuth has to be used within an EventAuthProvider");
  }

  return use(eventAuth);
}
