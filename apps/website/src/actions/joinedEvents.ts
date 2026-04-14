"use server";

import { JWT_SECRET } from "@/config";
import { EventCookie } from "@/db";
import { getEventCookies } from "@/lib/utils/eventCookie";

export type JoinedEvent = Omit<EventCookie, "userId">;

/**
 * Returns a list of all the events the current user has joined by checking for event cookies.
 *
 * @returns The list of currently joined events.
 */
export async function getJoinedEvents(): Promise<JoinedEvent[]> {
  return getEventCookies(JWT_SECRET)
    .map(cookies => cookies.map(({ userId: _, ...rest }) => rest))
    .getOrDefault([]);
}
