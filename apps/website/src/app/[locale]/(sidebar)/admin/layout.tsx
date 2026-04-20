"use client";

import { Sidebar as FlashSidebar } from "@flash/ui";
import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <>
      <header className={styles.header}>
        <FlashSidebar.Trigger />
      </header>
      <section className={styles.main}>{children}</section>
    </>
  );
}
