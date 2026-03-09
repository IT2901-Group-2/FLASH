import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/utils/auth";

export function middleware(req: NextRequest) {
  try {
    verifyAccessToken(req);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  // matcher: ["app/api/data/:path*"],
};
