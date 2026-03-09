"use client";
import { Button, Card, Input, Title } from "ui";
import styles from "./nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export default function Page() {
  const navigation = useRouter();
  const t = useTranslations("guest.nickname");
  const { id } = useParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : "";
  const { data } = useEventsQuery(eventId ? { id: [eventId] } : undefined);

  const [nickname, setNickname] = useState<string>("");
  if (!data) return;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigation.push(`/${id}`);
  };

  return (
    <div className={styles.conatiner}>
      <div className={styles.navigation} onClick={navigation.back}>
        <ArrowLeft />
        {t("back")}
      </div>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Title
            data-testid="title"
            align="center"
            size="large"
            as="h1"
            data-color="brand-purple"
            description={t("description")}
          >
            {t("title")}
          </Title>
          <Input
            aria-label="nickname-input"
            label={t("input.title")}
            placeholder={t("input.placeholder")}
            required
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          <Button
            variant="primary"
            icon={<ArrowRight />}
            iconPosition="right"
            data-color="brand-purple"
            type="submit"
            fill
          >
            Go to event
          </Button>
        </form>
      </Card>
    </div>
  );
}
