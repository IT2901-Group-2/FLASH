import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/utils/auth";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ["/app/[locale]/admin/dashboard/:path*"];

function isProtected(req: NextRequest): boolean {
  return PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route));
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
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
