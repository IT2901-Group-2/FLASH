"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";
import styles from "./JoinEvent.module.css";
import { Title } from "@flash/ui";
import RememberedEvents from "@/components/RememberedEvents/RememberedEvents";
import { LanguageToggleButton, ThemeToggleButton } from "@/components/ConfigButtons";

const Page = () => {
  const t = useTranslations("pages");

  return (
    <div className={styles.pageWrapper}>
      <LanguageToggleButton />
      <ThemeToggleButton />
      <Logo />
      <Title align="center" size="large" as="h1" description={t("login.description")}>
        {t("login.title")}
      </Title>
      <div className={styles.wrapper}>
        <JoinEventCard />
        <RememberedEvents />
      </div>
    </div>
  );
};

export default Page;
