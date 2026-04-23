import { ColorName } from "../types";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastAction = {
  label: React.ReactNode;
  onClick: () => void;
};

export type ToastItem = {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastAction;
  "data-color"?: ColorName;
  duration?: number;
  open?: boolean;
  position?: ToastPosition;
  icon?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type ToastContextType = {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  onToastsChange?: (toasts: ToastItem[]) => void;
};

export type CreateToastInput = Omit<ToastItem, "id" | "open"> & {
  id?: string;
  open?: boolean;
};

export type ToastStore = {
  toasts: ToastItem[];
  createToast: (toast: CreateToastInput) => string;
  updateToast: (id: string, toast: Partial<Omit<ToastItem, "id">>) => void;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};
