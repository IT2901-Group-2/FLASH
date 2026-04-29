"use client";

import styles from "./layout.module.css";
import { BaseHeader } from "@/components/Headers";

export default function Layout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <>
      <BaseHeader hideOnDesktop />
      <section className={styles.section}>{children}</section>
    </>
  );
}
