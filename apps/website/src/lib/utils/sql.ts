import { Result } from "typescript-result";

/**
 * Safely extracts the first element of a list. If list is empty, returns an error.
 * Useful to get the first row of an sql query.
 *
 * @example
 * ```typescript
 * const user = Result.try(() => db.select().from(userTable).limit(1)).map(rows =>
 *   getFirstRow(rows, "User not found")
 * );
 * ```
 *
 * @param rows A list
 * @param err_msg An optional error message
 * @returns A result containing the first element of the list or an error if the list is empty
 */
export function getFirstRow<T>(rows: T[], err_msg?: string): Result<T, Error> {
  return rows[0]
    ? (Result.ok(rows[0]) as Result<T, never>)
    : Result.error(new Error(err_msg));
}
