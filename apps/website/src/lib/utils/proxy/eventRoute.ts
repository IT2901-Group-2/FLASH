import { JWT_SECRET } from "@/config";
import { NextRequest } from "next/server";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { cookies } from "next/headers";

/**
 * Checks whether the request was made to the moderate sub-route of an event.
 *
 * @param request The request to check.
 * @returns A boolean indicating whether the request targets an event moderate route.
 */
export function isModerateRoute(request: NextRequest): boolean {
  return /^\/[^\/]+\/events\/[^\/]+\/moderate$/.test(request.nextUrl.pathname);
}

/**
 * Checks whether the event cookie for the given event grants moderator access.
 *
 * @param eventId The event id to check the moderator flag for.
 * @returns A promise that resolves to true if the cookie grants moderator access, false otherwise.
 */
export async function isModerator(eventId: string): Promise<boolean> {
  return getEventCookie(eventId, JWT_SECRET).fold(
    ({ isModerator }) => isModerator,
    () => false
  );
}

/**
 * Checks whether the request was made to a route that requires event session authentication.
 *
 * @param request The request to check.
 * @returns A boolean indicating whether the request is sent to an event route or not.
 */
export function isEventRoute(request: NextRequest): boolean {
  return /^\/[^\/]*\/events\/.+/.test(request.nextUrl.pathname);
}

/**
 * Retrieves the eventId from the route path.
 * Only usable within event routes, check with `isEventRoute` before invoking.
 *
 * @param request The request to retrieve the eventId from.
 * @returns The eventId of the event the request is accessing.
 */
export function getEventId(request: NextRequest): string {
  const eventId = /^\/[^\/]*\/events\/([^\/]*)/.exec(request.nextUrl.pathname)?.[1];
  if (eventId === undefined || eventId === "") {
    throw new Error("getEventId must only be invoked within an event route");
  }
  return eventId;
}

/**
 * Checks that the request carries a valid EventCookie.
 * If the checked cookie is malformed it will be cleared.
 *
 * @param eventId The event id to check the EventCookie for.
 * @returns A promise that resolves to true if the cookie is valid, false otherwise.
 */
export async function checkEventCookie(eventId: string): Promise<boolean> {
  return getEventCookie(eventId, JWT_SECRET)
    .onFailure(async () => {
      const cs = await cookies();
      cs.delete(`event-${eventId}`);
    })
    .fold(
      () => true,
      () => false
    );
}
