import { createContext, useContext } from "react";

interface CreateStrictContextOptions {
  name: string;
  errorMessage: string;
}

/**
 * A utility function that creates a React context with a custom hook for accessing the context value. It takes an object with a `name` and `errorMessage` property, and returns an object containing a `Provider` component for providing the context value and a `useContext` hook for consuming the context value. The `useContext` hook will throw an error with the provided `errorMessage` if it is used outside of the corresponding `Provider`, ensuring that the context is used correctly.
 *
 * @param name - The name of the context, which can be used for debugging purposes.
 * @param errorMessage - The error message to be thrown if the `useContext` hook is used outside of the corresponding `Provider`.
 * @returns An object containing a `Provider` component for providing the context value and a `useContext` hook for consuming the context value. The `useContext` hook will throw an error with the provided `errorMessage` if it is used outside of the corresponding `Provider`.
 */
export function createStrictContext<T>(options: CreateStrictContextOptions) {
  const Context = createContext<T | null>(null);
  Context.displayName = options.name;

  function useStrictContext(): T {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(options.errorMessage);
    return ctx;
  }

  return { Provider: Context.Provider, useContext: useStrictContext };
}
