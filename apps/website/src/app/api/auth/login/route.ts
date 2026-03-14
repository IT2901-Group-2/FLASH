import { verifyLogin, signAccessToken, signRefreshToken } from "@/lib/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const valid = await verifyLogin(password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  await signAccessToken();
  await signRefreshToken();
  return res;
}
