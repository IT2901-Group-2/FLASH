"use client";

import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
