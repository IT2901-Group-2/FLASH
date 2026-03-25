"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "@flash/ui";
import styles from "./AdminLogin.module.css";
import CameraIcon from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";
import { LanguageToggleButton, ThemeToggleButton } from "@/components/ConfigButtons";

export default function Page() {
  const t = useTranslations("pages.adminLogin");
  return (
    <div className={styles.pageWrapper}>
      <LanguageToggleButton />
      <ThemeToggleButton />
      <CameraIcon />
      <Title
        data-testid="title"
        align="center"
        size="large"
        as="h1"
        description={t("description")}
      >
        {t("title")}
      </Title>
      <SignInCard />
      <p>{t("subtitle")}</p>
    </div>
  );
}
