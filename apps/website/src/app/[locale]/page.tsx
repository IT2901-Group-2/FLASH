"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";
import styles from "./JoinEvent.module.css";
import { Title } from "@flash/ui";
import RememberedEvents from "@/components/RememberedEvents/RememberedEvents";
import LanguageToggleButton from "@/components/LanguageToggleButton/LanguageToggleButton";
import ThemeToggleButton from "@/components/ThemeToggleButton/ThemeToggleButton";

const Page = () => {
  const t = useTranslations("app");

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topControls}>
        <ThemeToggleButton />
        <LanguageToggleButton />
      </div>
      <Logo />
      <Title align="center" size="large" as="h1" description={t("description")}>
        {t("name")}
      </Title>
      <JoinEventCard />
      <RememberedEvents />
    </div>
  );
};

export default Page;
