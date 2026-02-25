"use client";

import { Sidebar } from "ui";
import styles from "./layout.module.css";
import AdminSidebar from "@/components/Sidebar/AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar.Provider>
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </Sidebar.Provider>
  );
}
