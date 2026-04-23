import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CreateToastInput, ToastItem, ToastStore } from "./Toast.type";

export type ToastProviderProps = {
  children: React.ReactNode;
  maxToasts?: number;
  initialToasts?: ToastItem[];
  onToastsChange?: (toasts: ToastItem[]) => void;
};

let _counter = 1;
const createToastId = () => `toast-${_counter++}`;

const ToastContext = createContext<ToastStore | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return context;
}

export function ToastProvider({
  children,
  maxToasts = 5,
  initialToasts = [],
  onToastsChange,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>(() =>
    initialToasts.slice(0, maxToasts)
  );

  useEffect(() => {
    onToastsChange?.(toasts);
  }, [onToastsChange, toasts]);

  const createToast = useCallback(
    (toast: CreateToastInput) => {
      const id = toast.id ?? createToastId();
      const nextToast: ToastItem = {
        ...toast,
        id,
        "data-color": toast["data-color"] ?? "neutral",
        duration: toast.duration ?? 5000,
        open: toast.open ?? true,
        position: toast.position ?? "bottom-right",
      };

      setToasts(current => {
        const exists = current.some(item => item.id === id);
        const next = exists
          ? current.map(item => (item.id === id ? { ...item, ...nextToast } : item))
          : [nextToast, ...current];
        return next.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const updateToast = useCallback((id: string, toast: Partial<Omit<ToastItem, "id">>) => {
    setToasts(current =>
      current.map(item => (item.id === id ? { ...item, ...toast } : item))
    );
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(current =>
      current.map(item => (item.id === id ? { ...item, open: false } : item))
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(item => item.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<ToastStore>(
    () => ({
      toasts,
      createToast,
      updateToast,
      dismissToast,
      removeToast,
      clearToasts,
    }),
    [toasts, createToast, updateToast, dismissToast, removeToast, clearToasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
