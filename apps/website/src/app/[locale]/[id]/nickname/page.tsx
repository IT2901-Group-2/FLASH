"use client";
import { Button, Card, Input, Title } from "ui";
import styles from "./Nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import {
  hasNicknameForEvent,
  setNickname as setEventNickname,
} from "@/hooks/useRememberEvents";
import { SubmitEvent, useState } from "react";

export default function Page() {
  const navigation = useRouter();
  const t = useTranslations("guest.nickname");
  const { id } = useParams();

  const [nickname, setNickname] = useState<string>("");

  const { data } = useEventsQuery({ id: [id?.toString() || ""] });
  if (!data) return;

  if (hasNicknameForEvent(id?.toString() ?? "")) navigation.push(`/${id}`);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEventNickname(id?.toString() ?? "", nickname);
    navigation.push(`/${id}`);
  };

  return (
    <div className={styles.conatiner}>
      <div className={styles.navigation} onClick={navigation.back}>
        <ArrowLeft />
        Back
      </div>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Title
            data-testid="title"
            align="center"
            size="large"
            as="h1"
            data-color="brand-purple"
            description="Enter a nickname so the host knows who uploaded the photos"
          >
            Welcome to {data[0]?.name}
          </Title>
          <Input
            aria-label="nickname-input"
            label="Nickname"
            placeholder="John Doe"
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
