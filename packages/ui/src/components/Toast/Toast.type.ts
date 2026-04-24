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
  /** An optional Id for the toast. Must be unique */
  id?: string;
  /** The title displayed on the toast */
  title: React.ReactNode;
  /** An optional description for the toast */
  description?: React.ReactNode;
  /**
   * If provided, the toast will have a button with a label and an
   * onClick action
   * */
  action?: ToastAction;
  /**
   * Color of the toast
   * @default "neutral"
   */
  "data-color"?: ColorName;
  /**
   * How long the toast will be displayed to the user in milliseconds.
   * @default 3000
   */
  duration?: number;
  /**
   * If the toast is open or not (if it is displayed while active)
   * @default true
   */
  open?: boolean;
  /**
   * The position of the toast on the screen
   * @default "bottom-right"
   */
  position?: ToastPosition;
  /** An optional icon to be displayed on the toast */
  icon?: React.ReactNode;
  /** Function called when the open status of the toast changes */
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
