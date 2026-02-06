"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "ui";
import styles from "./login.module.css";

const page = () => {
  return (
    <div className={styles.pageWrapper}>
      <Title
        align="center"
        size="medium"
        as="h1"
        data-color="neutral"
        description="Manage your photo events with ease"
      >
        PhotoEvent Admin
      </Title>
      <SignInCard />
    </div>
  );
};

export default page;
