import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });
    verifyRefreshToken(req, res);
    signAccessToken(res);
    signRefreshToken(res);
    return res;
  } catch {
    const errRes = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    return errRes;
  }
}
