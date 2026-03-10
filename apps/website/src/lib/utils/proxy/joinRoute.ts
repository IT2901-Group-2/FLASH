import { NextRequest } from "next/server";
import { makeRequest } from "../api";
import { getEventCodeSchema } from "@/db";

/**
 * Checks whether the request was made to an event join route.
 *
 * @param request The request to check.
 * @returns A boolean indicating whether the request is sent to a join route or not.
 */
export function isJoinRoute(request: NextRequest): boolean {
  return /^\/.*\/join\/.+/.test(request.nextUrl.pathname);
}

/**
 * Retrieves the join code from the route path.
 * Only usable within join routes, check with `isJoinRoute` before invoking.
 *
 * @param request The request to retrieve the join code from.
 * @returns The join code of the event the request is joining.
 */
export function getJoinCode(request: NextRequest): string {
  const code = /^\/.*\/join\/([^\/]*)/.exec(request.nextUrl.pathname)?.[1];
  if (code === undefined) {
    throw new Error("getJoinCode must only be invoked within a join route");
  }
  return code;
}

/**
 * Fetches the eventId of the event a join code belongs to.
 *
 * @param code The join code to fetch the event for.
 * @param request The request that triggered this check.
 * @returns The eventId of the associated event or null if the join code is invalid.
 */
export async function getEventByCode(
  request: NextRequest,
  code: string
): Promise<string | null> {
  return makeRequest(
    getEventCodeSchema,
    new URL(`/api/events/by-code/${code}`, request.url)
  )
    .then(c => c.eventId)
    .catch(() => null);
}
