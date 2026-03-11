import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/utils/auth";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ["/admin/dashboard"];

function isProtected(req: NextRequest): boolean {
  const withoutLocale = req.nextUrl.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
  return PROTECTED_ROUTES.some(route => withoutLocale.startsWith(route));
}

export default function middleware(req: NextRequest) {
  if (isProtected(req)) {
    try {
      verifyAccessToken(req);
    } catch {
      const locale =
        req.nextUrl.pathname.match(/^\/([a-z]{2}(-[A-Z]{2})?)/)?.[1] ??
        routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/admin`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
