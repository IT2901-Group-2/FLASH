import { clearAccessToken, clearRefreshToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearRefreshToken(res);
  clearAccessToken(res);
  return res;
}
