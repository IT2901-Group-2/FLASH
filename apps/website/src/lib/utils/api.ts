import z from "zod";

/**
 * Attempts to extract a human-readable error message from a failed HTTP response.
 * Tries to parse a JSON body first (looking for a `message` field), then falls
 * back to plain text, and finally falls back to a generic status-code message.
 */
export default async function readResponseError(res: Response): Promise<string> {
  try {
    const data = await res.clone().json();
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) return msg;
    }
  } catch {
    // ignore
  }
  try {
    const text = await res.clone().text();
    if (text.trim()) return text;
  } catch {
    // ignore
  }
  return `Request failed with status ${res.status} ${res.statusText}`;
}

export type HTTPMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "DELETE" | "PATCH";

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONObject =
  | null
  | string
  | number
  | boolean
  | object
  | (JSONObject | undefined)[]
  | { [key: string]: JSONObject | undefined };

/**
 * Helper function to parse a JSON like JS object, stripping all undefined values.
 *
 * @example
 * ```typescript
 * parseJSON({a: 1, b: null, c: undefined}); // -> {a: 1, b: null}
 * parseJSON([{a: {b: "foo", c: undefined}}]); // -> [{a: {b: "foo"}}]
 * ```
 *
 * @param data The JSON like object to parse into valid JSON.
 * @returns Valid JSON without undefined values.
 */
// TODO: Add tests
export function parseJSON(data: JSONObject): JSONValue {
  if (data === null || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.filter(x => x !== undefined).map(parseJSON);
  }

  const prototype = Object.getPrototypeOf(data);
  if (prototype === null || prototype === Object.prototype) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => (v !== undefined ? ([k, parseJSON(v)] as const) : null))
        .filter(x => x !== null)
    );
  }

  const obj: object = data;
  if ("toJSON" in obj && typeof obj.toJSON === "function") {
    return obj.toJSON();
  }

  return obj.toString();
}

/**
 * Helper function that fetches from the specified endpoint and parses
 * the response with the provided schema.
 * A JSON or Blob body can optionally be attached to the request.
 *
 * @param schema The schema to validate/transform the response with.
 * @param endpoint The endpoint to send the fetch request to.
 * @param method The HTTP method to use for the fetch request.
 * @param body The body to send with the fetch request.
 * @returns The response parsed by the provided schema.
 */
export async function makeRequest<T>(
  schema: z.ZodType<T>,
  endpoint: RequestInfo | URL,
  method: HTTPMethod = "GET",
  data?: JSONObject | Blob
): Promise<T> {
  const body =
    data === undefined
      ? null
      : data instanceof Blob
        ? await data.arrayBuffer()
        : JSON.stringify(parseJSON(data));

  const contentType =
    data === undefined ? null : data instanceof Blob ? data.type : "application/json";

  const response = await fetch(endpoint, {
    method,
    body,
    headers: contentType !== null ? { "Content-Type": contentType } : {},
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return z.parseAsync(schema, await response.json().catch(() => undefined));
}
