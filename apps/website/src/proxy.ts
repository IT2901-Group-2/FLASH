import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/utils/auth";
import {
  isEventRoute,
  getEventId,
  checkEventCookie,
  isJoinRoute,
  getJoinCode,
  getEventByCode,
} from "@/lib/utils/proxy";
import { createEventCookieValue } from "./lib/utils/eventCookie";
import { ADMIN_ID, JWT_SECRET } from "./config";

const handleI18nRouting = createMiddleware(routing);

const PROTECTED_ROUTES = ["/admin/dashboard"];
const ADMIN_LOGIN_ROUTE = "/admin";

function isAdminLogin(req: NextRequest): boolean {
  const withoutLocale = req.nextUrl.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
  return withoutLocale === ADMIN_LOGIN_ROUTE;
}

function isProtected(req: NextRequest): boolean {
  const withoutLocale = req.nextUrl.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
  return PROTECTED_ROUTES.some(route => withoutLocale.startsWith(route));
}

function attachAdminEventCookie(response: NextResponse, eventId: string): void {
  const cookieResult = createEventCookieValue(
    { eventId, userId: ADMIN_ID, name: "Admin", isModerator: true },
    JWT_SECRET
  );
  if (cookieResult.ok) {
    const { name, value, options } = cookieResult.value;
    response.cookies.set(name, value, options);
  }
}

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isEventRoute(request)) {
    const eventId = getEventId(request);
    const isAdmin = await verifyAccessToken()
      .then(() => true)
      .catch(() => false);

    if (isAdmin) {
      const response = handleI18nRouting(request);
      attachAdminEventCookie(response, eventId);
      return response;
    }

    const isAuthenticated = await checkEventCookie(eventId);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/`, request.url));
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

    const isAdmin = await verifyAccessToken()
      .then(() => true)
      .catch(() => false);
    if (isAdmin) {
      const response = NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
      attachAdminEventCookie(response, eventId);
      return response;
    }

    const isAuthenticated = await checkEventCookie(eventId);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
    }
  }

  if (isProtected(request)) {
    const redirectRes = NextResponse.redirect(new URL("/admin", request.url));
    try {
      await verifyAccessToken();
    } catch {
      return redirectRes;
    }
  }

  if (isAdminLogin(request)) {
    try {
      await verifyAccessToken();
      const locale =
        request.nextUrl.pathname.match(/^\/([a-z]{2}(-[A-Z]{2})?)/)?.[1] ?? "en";
      return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url));
    } catch {}
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
