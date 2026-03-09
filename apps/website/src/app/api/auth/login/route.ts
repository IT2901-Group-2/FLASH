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

  const { accessToken, expiresIn } = signAccessToken();
  const res = NextResponse.json({ accessToken, expiresIn });
  signRefreshToken(res);
  return res;
}
