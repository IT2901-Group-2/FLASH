import { NextRequest } from "next/server";
import { AsyncResult, Result } from "typescript-result";
import z from "zod";

export function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): AsyncResult<T, Error> {
  return Result.try(async () => z.parseAsync(schema, await request.json()));
}

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

  return Result.try(() => z.parseAsync(schema, params));
}
