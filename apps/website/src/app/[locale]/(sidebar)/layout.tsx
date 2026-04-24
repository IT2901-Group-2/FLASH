"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import { Sidebar as FlashSidebar, Toast, Toaster } from "@flash/ui";
import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return (
    <Toast.Provider>
      <FlashSidebar.Provider open={false}>
        <div className={styles.layout}>
          <Sidebar />
          <div className={styles.content}>
            <main className={styles.main}>{children}</main>
          </div>
        </div>
      </FlashSidebar.Provider>
      <Toaster />
    </Toast.Provider>
  );
}
