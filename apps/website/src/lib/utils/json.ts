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
