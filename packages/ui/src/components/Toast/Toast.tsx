import { useControllableState } from "@/util/hooks";
import { ToastItem } from "./Toast.type";
import { useEffect } from "react";
import { ToastProvider, useToast } from "./Toast.context";
import { X } from "lucide-react";
import styles from "./Toast.module.css";
import { Button } from "../Button";

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  toast: ToastItem;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  onRemove?: () => void;
};

const Toast = ({ toast, onOpenChange, onDismiss, onRemove, ...props }: ToastProps) => {
  const [open, setOpen] = useControllableState<boolean>({
    value: toast.open,
    defaultValue: true,
    onChange: nextOpen => {
      toast.onOpenChange?.(nextOpen);
      onOpenChange?.(nextOpen);
    },
  });

  useEffect(() => {
    if (!open) {
      onDismiss?.();
      const removeTimer = setTimeout(() => {
        onRemove?.();
      }, 250); // small delay to allow a CSS exit animation
      return () => clearTimeout(removeTimer);
    }

    if (!toast.duration || toast.duration <= 0) return;

    const timer = setTimeout(() => {
      setOpen(false);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [open, toast.duration]);

  if (!open) return null;

  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-color={toast["data-color"] ?? "neutral"}
      data-open={open}
      className={styles.toast}
    >
      {toast.icon && <span className={styles.icon}>{toast.icon}</span>}
      <div className={styles.text}>
        {toast.title && <span className={styles.title}>{toast.title}</span>}
        {toast.description && (
          <span className={styles.description}>{toast.description}</span>
        )}
        {toast.action && (
          <Button onClick={toast.action.onClick} size="xsmall" fill>
            {toast.action.label}
          </Button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss toast"
        data-toast-close
        className={styles.close}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  );
};

Toast.Provider = ToastProvider;

export { useToast };
export default Toast;
