"use client";
import { Button, Card, Input, Title } from "ui";
import styles from "./Nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Page() {
  const t = useTranslations("guest.nickname");
  return (
    <div className={styles.conatiner}>
      <div className={styles.navigation}>
        <ArrowLeft />
        Back
      </div>
      <Card className={styles.card}>
        <Title
          data-testid="title"
          align="center"
          size="large"
          as="h1"
          data-color="brand-purple"
          description="Enter a nickname so the host knows who uploaded the photos"
        >
          Welcome to EVENT
        </Title>
        <Input
          aria-label="nickname-input"
          label="Nickname"
          placeholder="John Doe"
          required
        />
        <Button
          variant="primary"
          icon={<ArrowRight />}
          iconPosition="right"
          data-color="brand-purple"
        >
          Go to event
        </Button>
      </Card>
    </div>
  );
}
