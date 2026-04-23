import { useToast } from "./Toast.context";
import Toast from "./Toast";
import { ToastPosition } from "./Toast.type";
import styles from "./Toast.module.css";

export type ToasterProps = {
  /** Where on the screen toasts should appear. Defaults to "bottom-right". */
  position?: ToastPosition;
};

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
export const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
  const { toasts, dismissToast, removeToast } = useToast();

  return (
    <div className={styles.toaster} data-position={position} aria-label="Notifications">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toaster;
