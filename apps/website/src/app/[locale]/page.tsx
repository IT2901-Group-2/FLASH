"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";
import styles from "./JoinEvent.module.css";
import { Title } from "ui";

const Page = () => {
  const t = useTranslations("JoinEventPage");

  return (
    <div className={styles.pageWrapper}>
      <Logo />
      <Title
        align="center"
        size="xlarge"
        as="h1"
        data-color="brand-purple"
        description={t("appDescription")}
      >
        {t("appTitle")}
      </Title>
      <JoinEventCard />
    </div>
  );
};

export default Page;
