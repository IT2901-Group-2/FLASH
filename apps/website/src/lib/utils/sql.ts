import { Result } from "typescript-result";

export function getFirstRow<T>(rows: T[], err_msg?: string): Result<T, Error> {
  return rows[0]
    ? (Result.ok(rows[0]) as Result<T, never>)
    : Result.error(new Error(err_msg));
}
