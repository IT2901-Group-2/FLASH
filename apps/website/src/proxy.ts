import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getEventCookie } from "./lib/utils/eventCookie";
import { JWT_SECRET } from "./config";
import { cookies } from "next/headers";

const handleI18nRouting = createMiddleware(routing);

/**
 * Checks whether the request was made to a route that requires event session authentication.
 *
 * @param request The request to check.
 * @param A boolean indicating whether the request is sent to an event route or not.
 */
function isEventRoute(request: NextRequest): boolean {
  return /^\/.*\/events\/.+/.test(request.nextUrl.pathname);
}

/**
 * Retrieves the eventId from the route path.
 * Only usable within event routes, check with `isEventRoute` before invoking.
 *
 * @param request The request to retrieve the eventId from.
 * @returns The eventId of the event the request is accessing.
 */
function getEventId(request: NextRequest): string {
  const eventId = /^\/.*\/events\/([^\/]*)/.exec(request.nextUrl.pathname)?.[1];
  if (eventId === undefined) {
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
async function checkEventCookie(eventId: string): Promise<boolean> {
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

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isEventRoute(request)) {
    const isAuthenticated = await checkEventCookie(getEventId(request));
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
