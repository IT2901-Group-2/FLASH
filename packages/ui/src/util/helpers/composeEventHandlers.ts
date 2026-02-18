/**
 * Composes multiple event handlers into a single handler. If any handler calls `event.preventDefault()`, the subsequent handlers will not be called.
 * @param handlers - An array of event handlers to compose.
 * @returns A single event handler that calls the provided handlers in order, respecting `event.preventDefault()`.
 */
export function composeEventHandlers<E extends React.SyntheticEvent | Event>(
  ...handlers: (((event: E) => void) | undefined)[]
) {
  return (event: E) => {
    for (const handler of handlers) {
      if ((event as React.SyntheticEvent).defaultPrevented) break;
      handler?.(event);
    }
  };
}
