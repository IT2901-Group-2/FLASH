"use server";

import { JWT_SECRET } from "@/config";
import { EventCookie } from "@/db";
import { getEventCookies } from "@/lib/utils/eventCookie";

export async function getJoinedEvents(): Promise<Omit<EventCookie, "userId">[]> {
  return getEventCookies(JWT_SECRET)
    .map(cookies => cookies.map(({ userId: _, ...rest }) => rest))
    .getOrDefault([]);
}
