import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getEventCookie } from "./lib/utils/eventCookie";
import { JWT_SECRET } from "./config";
import { cookies } from "next/headers";

const handleI18nRouting = createMiddleware(routing);

/**
 * Checks that the request carries a valid EventCookie.
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
  const eventId = /\/events\/(.*)$/g.exec(request.nextUrl.pathname)?.[1];

  if (eventId !== undefined) {
    const validCookie = await checkEventCookie(eventId);
    if (!validCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
