import { NextRequest, NextResponse } from "next/server";
import { parseFormData } from "@/lib/utils/validation";
import { createUserSchema } from "@/db";
import { userService } from "@/services/userService";
import { Result } from "typescript-result";
import { errorResponse } from "@/lib/utils/error";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest): Promise<NextResponse> {
  return Result.try(() => req.formData())
    .map(formData => parseFormData(formData, createUserSchema))
    .map(data => userService.joinEvent(data))
    .fold(eventId => redirect(`/events/${eventId}`), errorResponse);
}
