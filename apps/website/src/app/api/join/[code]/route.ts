import { NextRequest, NextResponse } from "next/server";
import { parseRequestBody } from "@/lib/utils/validation";
import { createUserSchema } from "@/db";
import { userService } from "@/services/userService";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/join/[code]">
): Promise<NextResponse> {
  const { code } = await params;

  return parseRequestBody(req, createUserSchema)
    .map(data => userService.joinEvent(code, data))
    .fold(
      eventId =>
        NextResponse.redirect(new URL(`/${eventId}`, req.url), {
          status: 303,
        }),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
