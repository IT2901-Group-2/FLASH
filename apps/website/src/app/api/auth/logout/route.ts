import { clearAccessToken, clearRefreshToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  await clearRefreshToken();
  await clearAccessToken();
  return res;
}
