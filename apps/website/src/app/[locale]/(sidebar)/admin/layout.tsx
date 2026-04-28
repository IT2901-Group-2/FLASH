"use client";

import styles from "./layout.module.css";
import BaseHeader from "@/components/Header/BaseHeader";

export default function Layout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <>
      <BaseHeader />
      <section className={styles.section}>{children}</section>
    </>
  );
}
