import { imageService } from "@/services/imageService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest): Promise<NextResponse> {
  return new NextResponse(await imageService.test());
}
