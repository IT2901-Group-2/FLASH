/**
 * Composes multiple event handlers into a single handler function.
 *
 * Executes handlers in sequence, stopping early if any handler prevents the default action.
 * Undefined handlers are safely skipped, allowing for conditional or optional handlers.
 *
 * @template E - The event type, either a React SyntheticEvent or native Event
 * @param handlers - Variable number of event handler functions or undefined values
 * @returns A composed event handler that executes all provided handlers in order
 *
 * @example
 * ```typescript
 * const handleClick = composeEventHandlers(
 *   (e) => console.log('First'),
 *   (e) => console.log('Second')
 * );
 * button.addEventListener('click', handleClick);
 * ```
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
