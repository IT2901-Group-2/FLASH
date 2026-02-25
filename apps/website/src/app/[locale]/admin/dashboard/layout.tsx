"use client";

import { Button } from "ui";
import styles from "./layout.module.css";
import AdminSidebar from "@/components/Sidebar/AdminSidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className={styles.layout}>
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <Button onClick={() => setSidebarOpen(v => !v)}>
        {sidebarOpen ? "Close" : "Open"} Sidebar
      </Button>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
