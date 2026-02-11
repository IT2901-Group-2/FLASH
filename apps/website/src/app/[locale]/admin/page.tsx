"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "ui";
import styles from "./AdminLogin.module.css";
import CameraIcon from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("AdminLogin");
  return (
    <div className={styles.pageWrapper}>
      <CameraIcon />
      <Title
        align="center"
        size="large"
        as="h1"
        data-color="brand-purple"
        description={t("description")}
      >
        {t("title")}
      </Title>
      <SignInCard />
      <p>{t("undertext")}</p>
    </div>
  );
}
