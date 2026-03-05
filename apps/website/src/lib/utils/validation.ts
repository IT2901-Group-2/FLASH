import { NextRequest } from "next/server";
import { AsyncResult, Result } from "typescript-result";
import z from "zod";
import { mapZodError } from "./error";

/**
 * Utility function to validate a `NextRequest` body against a `zod` schema.
 *
 * @param request The request whose body to validate.
 * @param schema The `zod` schema to validate against.
 * @returns A result with the parsed result body or an error.
 */
export function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): AsyncResult<T, Error> {
  return Result.try(async () => z.parseAsync(schema, await request.json())).mapError(
    mapZodError
  );
}

/**
 * Utility function to validate `URLSearchParams` against a `zod` schema.
 *
 * @param searchParams The `URLSearchParams` object to validate.
 * @param schema The `zod` schema to validate against.
 * @returns A result with the search params or an error.
 */
export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): AsyncResult<T, Error> {
  const params = searchParams
    .keys()
    .reduce(
      (acc, key) => ({ ...acc, [key]: searchParams.getAll(key) }),
      {} as Record<string, unknown[]>
    );

  return Result.try(() => z.parseAsync(schema, params)).mapError(mapZodError);
}
