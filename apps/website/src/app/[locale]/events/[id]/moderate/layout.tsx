"use client";

import styles from "./layout.module.css";

export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return <main className={styles.main}>{children}</main>;
}
