"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import styles from "./JoinEvent.module.css";

const Page = () => {
  return (
    <div className={styles.pageWrapper}>
      <Logo />
      <JoinEventCard />
    </div>
  );
};

export default Page;
