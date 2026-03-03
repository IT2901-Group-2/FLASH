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

/**
 * Wrapper around `fetch` that throws a descriptive error on non-2xx
 * responses and returns the parsed JSON body typed as `T`, avoiding
 * repetitive error handling and type casting at every call site.
 */
export async function fetchJson<T>(
  endpoint: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, init);
  if (!res.ok) throw new Error(await readResponseError(res));
  return (await res.json()) as T;
}

export type HTTPMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Helper function that fetches from the specified endpoint and parses
 * the response with the provided schema.
 * A JSON body can optionally be attached to the request.
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
  body?: object
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    ...(body !== undefined
      ? {
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        }
      : {}),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return z.parseAsync(schema, await response.json().catch(() => undefined));
}
