import { parseSearchParams } from "@/lib/utils/validation";
import { getEventCodeParamsSchema } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/code">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getEventCodeParamsSchema).fold(
    async data => {
      if (data.role === "moderator") {
        return withAuth(
          async () =>
            eventService
              .getEventCode(eventId, data)
              .fold(code => NextResponse.json(code), errorResponse),
          { level: "moderator", eventId }
        );
      }

      return eventService
        .getEventCode(eventId, data)
        .fold(code => NextResponse.json(code), errorResponse);
    },
    errorResponse
  );
}
