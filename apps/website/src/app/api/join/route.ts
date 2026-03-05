import { NextRequest, NextResponse } from "next/server";
import { parseFormData } from "@/lib/utils/validation";
import { createUserSchema } from "@/db";
import { userService } from "@/services/userService";
import { Result } from "typescript-result";

export async function POST(req: NextRequest): Promise<NextResponse> {
  return Result.try(() => req.formData())
    .map(formData => parseFormData(formData, createUserSchema))
    .map(data => userService.joinEvent(data))
    .fold(
      eventId =>
        NextResponse.redirect(new URL(`/${eventId}`, req.url), {
          status: 303,
        }),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
