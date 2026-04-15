import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/auth";
import {
  isEventRoute,
  getEventId,
  checkEventCookie,
  isModerateRoute,
  isModerator,
  isJoinRoute,
  getJoinCode,
  getEventByCode,
} from "@/lib/utils/proxy";
import { setEventCookie } from "./lib/utils/eventCookie";
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

async function tryRefreshInMiddleware(): Promise<boolean> {
  try {
    await verifyRefreshToken();
    await signAccessToken();
    await signRefreshToken();

    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isEventRoute(request)) {
    const eventId = getEventId(request);
    const isAdmin = await verifyAccessToken()
      .then(() => true)
      .catch(() => false);

    if (isAdmin) {
      await setEventCookie(
        { eventId, id: `${ADMIN_ID}-${eventId}`, name: "Admin", isModerator: true },
        JWT_SECRET
      ).getOrThrow();
    }

    const isAuthenticated = await checkEventCookie(eventId);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    if (isModerateRoute(request) && !(await isModerator(eventId))) {
      return NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
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
      await setEventCookie(
        { eventId, id: `${ADMIN_ID}-${eventId}`, name: "Admin", isModerator: true },
        JWT_SECRET
      ).getOrThrow();
    }

    const isAuthenticated = await checkEventCookie(eventId);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(`/events/${eventId}`, request.url));
    }
  }

  if (isProtected(request)) {
    try {
      await verifyAccessToken();
    } catch {
      const refreshed = await tryRefreshInMiddleware();
      if (!refreshed) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }
  }

  if (isAdminLogin(request)) {
    const locale =
      request.nextUrl.pathname.match(/^\/([a-z]{2}(-[A-Z]{2})?)/)?.[1] ?? "en";

    const isValidToken = await verifyAccessToken()
      .then(() => true)
      .catch(() => false);
    const hasAccess = isValidToken || (await tryRefreshInMiddleware());

    if (hasAccess) {
      return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
