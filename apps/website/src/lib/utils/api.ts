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
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(await readResponseError(res));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Normalizes a date value to an ISO 8601 string for API serialization.
 * Returns undefined if no value is provided.
 */
export function toIso(value?: Date): string | undefined {
  if (value === undefined) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}
