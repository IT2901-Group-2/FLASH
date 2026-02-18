/**
 * Inspired by https://github.com/navikt/aksel/tree/main/%40navikt/core/react/src/utils/hooks
 * Rewritten and simplified for our use-case.
 */

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * An interface representing the metadata associated with a descendant element. This metadata can include properties such as `disabled`, which indicates whether the descendant is currently disabled. This type is used when registering descendants to provide additional information about their state.
 *
 * @template M - The type of the metadata, which must be an object.
 */
type DescendantMeta<M extends object> = M & { disabled?: boolean };

/**
 * An entry representing a descendant element, including its node, index, and any associated metadata (e.g., whether it's disabled). This type is used to manage and navigate through descendant elements in a component.
 *
 * @template T - The type of the descendant element, which extends `HTMLElement`.
 * @template M - The type of the metadata associated with the descendant, which must be an object.
 */
export type DescendantEntry<T extends HTMLElement, M extends object> = M & {
  node: T;
  index: number;
  disabled?: boolean;
};

/**
 * An interface defining the methods for managing descendant elements, including registration, unregistration, retrieval of descendant values, counting, and navigation between enabled descendants. This interface is implemented by the `useDescendantsManager` hook to provide a consistent API for managing descendants in components.
 *
 * @template T - The type of the descendant element, which extends `HTMLElement`.
 */
export interface DescendantsManager<T extends HTMLElement, M extends object> {
  register(node: T, meta: DescendantMeta<M>): void;
  unregister(node: T): void;
  values(): Array<DescendantEntry<T, M>>;
  count(): number;
  nextEnabled(index: number, loop?: boolean): DescendantEntry<T, M> | undefined;
  prevEnabled(index: number, loop?: boolean): DescendantEntry<T, M> | undefined;
  firstEnabled(): DescendantEntry<T, M> | undefined;
  lastEnabled(): DescendantEntry<T, M> | undefined;
}

/**
 * A custom hook that manages a list of descendant elements, allowing for registration, unregistration, and navigation between them. This is particularly useful for components like menus, tabs, or lists where you need to keep track of child elements and their states (e.g., disabled).
 *
 * @returns An object containing methods to register/unregister descendants, retrieve their values, count them, and navigate to the next/previous enabled descendant.
 */
function useDescendantsManager<
  T extends HTMLElement,
  M extends object,
>(): DescendantsManager<T, M> {
  const [, rerender] = useState(0);
  const mapRef = useRef(new Map<T, DescendantMeta<M>>());

  /**
   * Registers a descendant element with its associated metadata. If the element is already registered, it updates the metadata in place to avoid unnecessary re-renders. If it's a new element, it adds it to the map and triggers a re-render.
   *
   * @param node - The descendant element to register.
   * @param meta - The metadata associated with the descendant, which can include properties like `disabled`.
   */
  const register = useCallback((node: T, meta: DescendantMeta<M>) => {
    const map = mapRef.current;
    if (!map.has(node)) {
      map.set(node, meta);
      rerender(n => n + 1);
    } else Object.assign(map.get(node)!, meta);
  }, []);

  /**
   * Unregisters a descendant element. If the element is found in the map, it removes it and triggers a re-render to update the state of the descendants.
   *
   * @param node - The descendant element to unregister.
   */
  const unregister = useCallback((node: T) => {
    if (mapRef.current.has(node)) {
      mapRef.current.delete(node);
      rerender(n => n + 1);
    }
  }, []);

  /**
   * Retrieves an array of all registered descendant entries, sorted in document order. Each entry includes the descendant's node, its index, and any associated metadata (e.g., whether it's disabled).
   *
   * @returns An array of descendant entries.
   */
  const values = useCallback((): Array<DescendantEntry<T, M>> => {
    return [...mapRef.current.keys()]
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
      .map((node, index) => ({
        ...(mapRef.current.get(node) as DescendantMeta<M>),
        node,
        index,
      }));
  }, []);

  /**
   * Returns the total count of registered descendants.
   * @return The number of registered descendants.
   */
  const count = useCallback(() => mapRef.current.size, []);

  /**
   * Finds the next enabled descendant starting from a given index. It can optionally loop back to the beginning of the list if it reaches the end without finding an enabled descendant.
   *
   * @param index - The starting index to search from.
   * @param loop - Whether to loop back to the beginning of the list if the end is reached.
   * @returns The next enabled descendant entry, or `undefined` if none are found.
   */
  const nextEnabled = useCallback(
    (index: number, loop = true): DescendantEntry<T, M> | undefined => {
      const all = values();
      const total = all.length;
      for (let i = 1; i <= total; i++) {
        const nextIdx = loop ? (index + i) % total : index + i;
        if (nextIdx >= total) return undefined;
        if (!all[nextIdx].disabled) return all[nextIdx];
      }
    },
    [values]
  );

  /**
   * Finds the previous enabled descendant starting from a given index. It can optionally loop back to the end of the list if it reaches the beginning without finding an enabled descendant.
   *
   * @param index - The starting index to search from.
   * @param loop - Whether to loop back to the end of the list if the beginning is reached.
   * @returns The previous enabled descendant entry, or `undefined` if none are found.
   */
  const prevEnabled = useCallback(
    (index: number, loop = true): DescendantEntry<T, M> | undefined => {
      const all = values();
      const total = all.length;
      for (let i = 1; i <= total; i++) {
        const prevIdx = loop ? (((index - i) % total) + total) % total : index - i;
        if (prevIdx < 0) return undefined;
        if (!all[prevIdx].disabled) return all[prevIdx];
      }
    },
    [values]
  );

  /**
   * Finds the first enabled descendant in the list. If no enabled descendants are found, it returns `undefined`.
   *
   * @returns The first enabled descendant entry, or `undefined` if none are found.
   */
  const firstEnabled = useCallback(() => values().find(d => !d.disabled), [values]);

  /**
   * Finds the last enabled descendant in the list. If no enabled descendants are found, it returns `undefined`.
   *
   * @returns The last enabled descendant entry, or `undefined` if none are found.
   */
  const lastEnabled = useCallback(
    () => [...values()].reverse().find(d => !d.disabled),
    [values]
  );

  return {
    register,
    unregister,
    values,
    count,
    nextEnabled,
    prevEnabled,
    firstEnabled,
    lastEnabled,
  };
}

/**
 * Creates a context for managing descendant elements, providing a provider component and hooks for accessing the context and registering descendants. This is useful for components that need to manage a list of child elements, such as menus, tabs, or lists.
 *
 * @returns An array containing the DescendantsProvider component, a hook to access the descendants context, a hook to access the descendants manager, and a hook to register individual descendants.
 */
export function createDescendantContext<T extends HTMLElement, M extends object>() {
  const Context = createContext<DescendantsManager<T, M> | null>(null);

  /**
   * A provider component that wraps its children with the descendants context. It takes a `manager` prop, which is an instance of the descendants manager created by `useDescendantsManager`, and provides it to the context for use by descendant components.
   *
   * @param manager - The descendants manager instance to provide to the context.
   * @param children - The child components that will have access to the descendants context.
   * @returns A React element that provides the descendants context to its children.
   */
  function DescendantsProvider({
    manager,
    children,
  }: {
    manager: DescendantsManager<T, M>;
    children: ReactNode;
  }) {
    return <Context.Provider value={manager}>{children}</Context.Provider>;
  }

  /**
   * A custom hook that retrieves the descendants manager from the context. If the context is not found (i.e., if the component using this hook is not wrapped in a `DescendantsProvider`), it throws an error to indicate that the context is missing.
   *
   * @throws Will throw an error if the hook is used outside of a `DescendantsProvider`.
   * @returns The descendants manager instance from the context.
   */
  function useDescendantsContext(): DescendantsManager<T, M> {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useDescendantsContext: missing DescendantsProvider");
    return ctx;
  }

  /**
   * A custom hook that creates and returns a new descendants manager instance. This hook can be used to create a manager that can be passed to the `DescendantsProvider` component, allowing descendant components to register themselves and access the manager's functionality.
   *
   * @returns A new instance of the descendants manager created by `useDescendantsManager`.
   */
  function useDescendants() {
    return useDescendantsManager<T, M>();
  }

  /**
   * A custom hook that allows a descendant component to register itself with the descendants manager. It takes metadata as an argument, which can include properties like `disabled`, and returns an object containing a `register` function to be used as a ref callback, the index of the registered descendant, and the descendants manager instance.
   *
   * @param meta - The metadata associated with the descendant, which can include properties like `disabled`.
   * @returns An object containing a `register` function to be used as a ref callback, the index of the registered descendant, and the descendants manager instance.
   */
  function useDescendant(meta: DescendantMeta<M>) {
    const manager = useDescendantsContext();
    const nodeRef = useRef<T | null>(null);
    const metaRef = useRef(meta);
    metaRef.current = meta;

    const register = useCallback(
      (node: T | null) => {
        if (node) {
          nodeRef.current = node;
          manager.register(node, metaRef.current);
        } else if (nodeRef.current) {
          manager.unregister(nodeRef.current);
          nodeRef.current = null;
        }
      },
      [manager]
    );

    // Re-register on meta changes (e.g. disabled toggling) without unmounting
    useLayoutEffect(() => {
      if (nodeRef.current) manager.register(nodeRef.current, metaRef.current);
      // Only re-run when manager or disabled changes — value is stable per item
    }, [manager, meta.disabled]);

    const index = nodeRef.current
      ? manager.values().findIndex(d => d.node === nodeRef.current)
      : -1;

    return { register, index, descendants: manager };
  }

  return [
    DescendantsProvider,
    useDescendantsContext,
    useDescendants,
    useDescendant,
  ] as const;
}
