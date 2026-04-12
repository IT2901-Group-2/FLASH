"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import { Sidebar as FlashSidebar } from "@flash/ui";
import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return (
    <FlashSidebar.Provider open={false}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.content}>
          <header className={styles.header}>
            <FlashSidebar.Trigger />
          </header>
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </FlashSidebar.Provider>
  );
}
