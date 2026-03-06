import { NextResponse } from "next/server";
import { JSONValue, parseAsJSON } from "./json";
import z, { ZodError } from "zod";

/**
 * An error with a json body and a HTTP response code.
 * The response code defaults to 500.
 */
export class HTTPError extends Error {
  code: number;
  json?: JSONValue;

  constructor(json?: JSONValue, code: number = 500) {
    super();
    this.code = code;
    this.json = json;
  }
}

/**
 * Maps any `zod` validation error into a more readable `HTTPError` with a default response code of 400.
 * Any errors which are not `zod` validation errors will be returned as is.
 *
 * @param error An error to be mapped.
 * @param code The error code to attach with the mapped error.
 * @returns A `zod` error mapped to a `HTTPError` or the provided error.
 */
export function mapZodError(error: Error, code: number = 400): Error {
  return error instanceof ZodError
    ? new HTTPError(parseAsJSON(z.treeifyError(error)), code)
    : error;
}

/**
 * Transforms an Error into an appropriate HTTP response.
 * If the error specifies a `code` property it will be used as the HTTP status code.
 * If the error specifies a `json` property it will be preferred over `message`.
 *
 * @param error The error to return as an HTTP response.
 * @returns An HTTP response which describes the error.
 */
export function errorResponse(error: Error): NextResponse {
  const status = "code" in error && typeof error.code === "number" ? error.code : 500;
  const message =
    "json" in error && error.json !== undefined ? error.json : error.message;

  return NextResponse.json(message, { status });
}
