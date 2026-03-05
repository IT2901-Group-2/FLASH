"use server";

import { EventAuth } from "@/providers/EventAuthProvider";
import { getEventCookie } from "./eventCookie";

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
