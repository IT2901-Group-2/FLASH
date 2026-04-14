"use server";

import { JWT_SECRET } from "@/config";
import { EventCookie } from "@/db";
import { getEventCookies } from "@/lib/utils/eventCookie";

/**
 * Returns a list of all the events the current user has joined by checking for event cookies.
 *
 * @returns The list of currently joined events.
 */
export async function getJoinedEvents(): Promise<Omit<EventCookie, "userId">[]> {
  return getEventCookies(JWT_SECRET)
    .map(cookies => cookies.map(({ userId: _, ...rest }) => rest))
    .getOrDefault([]);
}
