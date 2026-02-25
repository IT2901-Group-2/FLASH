"use client";

import styles from "./layout.module.css";
import AdminSidebar from "@/components/Sidebar/AdminSidebar";
import { Sidebar } from "ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar.Provider>
      <div className={styles.layout}>
        <AdminSidebar />
        <div className={styles.content}>
          <header className={styles.header}>
            <Sidebar.Trigger />
          </header>
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </Sidebar.Provider>
  );
}
