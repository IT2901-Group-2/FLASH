"use client";
import { Plus } from "lucide-react";
import { Button, Title } from "ui";
import styles from "./page.module.css";
import CreateEventCard from "@/components/CreateEventCard/CreateEventCard";
import { useRef } from "react";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("admin.dashboard.event.page");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <CreateEventCard ref={dialogRef} onClose={() => dialogRef.current?.close()} />
      <div className={styles.header}>
        <Title description={t("description")}>{t("title")}</Title>
        <Button
          icon={<Plus />}
          data-color="brand-purple"
          onClick={() => dialogRef.current?.showModal()}
        >
          {t("createNew")}
        </Button>
      </div>
    </>
  );
};

export default Page;
