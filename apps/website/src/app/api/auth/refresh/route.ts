import { verifyRefreshToken, signAccessToken } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    verifyRefreshToken(req);
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const { accessToken, expiresIn } = signAccessToken();
  return NextResponse.json({ accessToken, expiresIn });
}
