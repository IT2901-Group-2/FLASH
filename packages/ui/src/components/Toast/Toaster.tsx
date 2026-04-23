import { useToast } from "./Toast.context";
import Toast from "./Toast";
import styles from "./Toast.module.css";
import { ToastItem, ToastPosition } from "./Toast.type";
import { useMemo } from "react";

const POSITION_ORDER: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

/**
 * Drop a single <Toaster /> anywhere in your component tree (inside ToastProvider)
 * and all toasts created via `useToast().createToast(...)` will appear here, stacked.
 *
 * @example
 * // In your app root:
 * <Toast.Provider>
 *   <App />
 *   <Toaster position="bottom-right" />
 * </Toast.Provider>
 */
export const Toaster = () => {
  const { toasts, dismissToast, removeToast } = useToast();

  const groupedToasts = useMemo(() => {
    return toasts.reduce<Record<string, ToastItem[]>>((acc, toast) => {
      const position = toast.position;
      if (!position) return acc;

      (acc[position] ||= []).push(toast);
      return acc;
    }, {});
  }, [toasts]);

  return (
    <>
      {POSITION_ORDER.map(position => {
        const items = groupedToasts[position];
        if (!items?.length) return null;

        return (
          <div
            key={position}
            className={styles.toaster}
            data-position={position}
            aria-label="Notifications"
          >
            {items.map(toast => (
              <Toast
                key={toast.id}
                toast={toast}
                onDismiss={() => dismissToast(toast.id!)}
                onRemove={() => removeToast(toast.id!)}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

export default Toaster;
