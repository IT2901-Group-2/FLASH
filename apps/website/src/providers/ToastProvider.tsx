"use client";

import { Toast, Toaster } from "@flash/ui";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider>
      {children}
      <Toaster />
    </Toast.Provider>
  );
}
