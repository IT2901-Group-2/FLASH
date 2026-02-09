"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import styles from "./JoinEvent.module.css";
import { Title } from "ui";

const Page = () => {
  return (
    <div className={styles.pageWrapper}>
      <Logo />
      <Title
        align="center"
        size="xlarge"
        as="h1"
        data-color="brand-purple"
        description="Manage your photo events with ease"
      >
        PhotoEvent
      </Title>
      <JoinEventCard />
    </div>
  );
};

export default Page;
