"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "ui";
import styles from "./AdminLogin.module.css";
import CameraIcon from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("admin.login");
  return (
    <div className={styles.pageWrapper}>
      <CameraIcon />
      <Title
        data-testid="title"
        align="center"
        size="large"
        as="h1"
        data-color="brand-purple"
        description={t("description")}
      >
        {t("pageTitle")}
      </Title>
      <SignInCard />
      <p>{t("undertext")}</p>
    </div>
  );
}
