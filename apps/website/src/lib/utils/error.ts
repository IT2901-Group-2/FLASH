import { NextResponse } from "next/server";

export class HTTPError extends Error {
  code: number;

  constructor(message?: string, code: number = 500) {
    super(message);
    this.code = code;
  }
}

export function errorResponse(error: Error): NextResponse {
  const status = "code" in error && typeof error.code === "number" ? error.code : 500;
  return NextResponse.json(error.message, { status });
}
