"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "ui";
import styles from "./login.module.css";
import { Camera } from "lucide-react";

const page = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cameraWrapper}>
        <Camera className={styles.camera} />
      </div>
      <Title
        align="center"
        size="large"
        as="h1"
        data-color="brand-purple"
        description="Manage your photo events with ease"
      >
        PhotoEvent Admin
      </Title>
      <SignInCard />
      <p>Self-hosted Photo Event Management System</p>
    </div>
  );
};

export default page;
