"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import { useTranslations } from "next-intl";
import styles from "./JoinEvent.module.css";
import { Title } from "ui";
import RememberedEvents from "@/components/RememberedEvents/RememberedEvents";

const Page = () => {
  const t = useTranslations("JoinEventPage");

  return (
    <div className={styles.pageWrapper}>
      <Logo />
      <Title align="center" size="large" as="h1" description={t("appDescription")}>
        {t("appTitle")}
      </Title>
      <JoinEventCard />
      <RememberedEvents />
    </div>
  );
};

export default Page;
