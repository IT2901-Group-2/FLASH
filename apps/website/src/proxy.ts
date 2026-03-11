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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
