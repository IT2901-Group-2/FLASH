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
import { redirect } from "next/navigation";

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

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isEventRoute(request)) {
    const isAuthenticated = await checkEventCookie(getEventId(request));
    if (!isAuthenticated) {
      redirect("/");
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
      redirect(`/events/${eventId}`);
    }
  }

  if (isProtected(request)) {
    const redirectRes = NextResponse.redirect(new URL("/admin", request.url));
    try {
      verifyAccessToken(request, redirectRes);
    } catch {
      return redirectRes;
    }
  }

  if (isAdminLogin(request)) {
    try {
      verifyAccessToken(request, new NextResponse());
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
