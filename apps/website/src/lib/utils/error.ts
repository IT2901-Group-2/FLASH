import { NextResponse } from "next/server";
import { JSONValue, parseAsJSON } from "./json";
import z, { ZodError } from "zod";

export class HTTPError extends Error {
  code: number;
  json?: JSONValue;

  constructor(json?: JSONValue, code: number = 500) {
    super();
    this.code = code;
    this.json = json;
  }
}

export function mapZodError(error: Error, code: number = 400): Error {
  if (!(error instanceof ZodError)) {
    return error;
  }

  return new HTTPError(parseAsJSON(z.treeifyError(error)), code);
}

export function errorResponse(error: Error): NextResponse {
  const status = "code" in error && typeof error.code === "number" ? error.code : 500;
  const message =
    "json" in error && error.json !== undefined ? error.json : error.message;

  return NextResponse.json(message, { status });
}
