import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { errorResponse } from "@/lib/utils/error";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/download">
): Promise<NextResponse> {
  const { eventId } = await params;

  return imageService.downloadImages(eventId).fold(
    zip =>
      new NextResponse(new Uint8Array(zip), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="event-${eventId}.zip"`,
        },
      }),
    errorResponse
  );
}
