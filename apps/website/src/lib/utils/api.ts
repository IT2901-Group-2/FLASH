import { JSONObject, parseAsJSON } from "./json";
import z from "zod";

export type HTTPMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "DELETE" | "PATCH";

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

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) {
    const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] ?? "en";
    window.location.href = `/${locale}/admin`;
    throw new Error("Session expired");
  }
}

async function buildRequest(
  method: HTTPMethod,
  data?: JSONObject | Blob
): Promise<RequestInit> {
  const body =
    data === undefined
      ? null
      : data instanceof Blob
        ? await data.arrayBuffer()
        : JSON.stringify(parseAsJSON(data));

  const contentType =
    data === undefined ? null : data instanceof Blob ? data.type : "application/json";

  return {
    method,
    body,
    headers: contentType !== null ? { "Content-Type": contentType } : {},
  };
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
  const requestInit = await buildRequest(method, data);
  const response = await fetch(endpoint, requestInit);

  // On 401, attempt a single token refresh then retry
  if (response.status === 401) {
    // If a refresh isn't already in flight, start one
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    // All concurrent 401s wait for the same refresh
    await refreshPromise;

    const retryResponse = await fetch(endpoint, requestInit);
    if (!retryResponse.ok) {
      throw new Error(await readResponseError(retryResponse));
    }
    return z.parseAsync(schema, await retryResponse.json().catch(() => undefined));
  }

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  return z.parseAsync(schema, await response.json().catch(() => undefined));
}
