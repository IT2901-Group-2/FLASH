import { NextRequest } from "next/server";
import { AsyncResult, Result } from "typescript-result";
import z from "zod";

export function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): AsyncResult<T, Error> {
  return Result.try(request.json).mapCatching(body =>
    z.parseAsync(schema, body)
  ) as AsyncResult<T, Error>;
}
