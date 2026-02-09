"use client";
import SignInCard from "@/components/SignInCard/SignInCard";
import { Title } from "ui";
import styles from "./adminLogin.module.css";
import CameraIcon from "@/components/Logo/Logo";

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <CameraIcon />
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
}
