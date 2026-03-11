import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import {
  isEventRoute,
  getEventId,
  checkEventCookie,
  isJoinRoute,
  getJoinCode,
  getEventByCode,
} from "@/lib/utils/proxy";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isEventRoute(request)) {
    const isAuthenticated = await checkEventCookie(getEventId(request));
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isJoinRoute(request)) {
    const code = getJoinCode(request);
    const eventId = await getEventByCode(request, code);

    if (eventId === null) {
      return new NextResponse(`Event with join code ${code} does not exist.`, {
        status: 404,
      });
    }

    const isAuthenticated = await checkEventCookie(eventId);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
