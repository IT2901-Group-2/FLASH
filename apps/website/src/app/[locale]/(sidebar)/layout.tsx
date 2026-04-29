"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
