import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    verifyRefreshToken();
    signAccessToken();
    signRefreshToken();
    return res;
  } catch {
    const errRes = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    return errRes;
  }
}
