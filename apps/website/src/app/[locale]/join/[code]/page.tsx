"use client";
import { Button, Card, Input, Title } from "ui";
import styles from "./nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useEventByCodeQuery, useEventsQuery } from "@/hooks/useEvents";

export default function Page() {
  const navigation = useRouter();
  const tNickname = useTranslations("guest.login.card.nickname");
  const tErrors = useTranslations("guest.login.card.errors");
  const cActions = useTranslations("common.actions");
  const cFields = useTranslations("common.fields");
  const { code } = useParams<{ code: string }>();
  const joinCode = typeof code === "string" ? code : "";

  const { data: eventCodeData } = useEventByCodeQuery(joinCode);
  const { data: eventData } = useEventsQuery(
    eventCodeData?.eventId ? { id: [eventCodeData.eventId] } : undefined,
    !!eventCodeData?.eventId
  );
  const eventName = eventData?.[0]?.name;

  const [nickname, setNickname] = useState<string>("");
  const [nicknameError, setNicknameError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/join", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });

    if (response.ok) {
      window.location.assign(response.url);
      return;
    }

    const payload = (await response.json().catch(() => null)) as
      | { message?: string; code?: string }
      | string
      | null;
    const payloadMessage =
      typeof payload === "string"
        ? payload
        : typeof payload?.message === "string"
          ? payload.message
          : "";
    const payloadCode =
      typeof payload === "object" && payload !== null && typeof payload.code === "string"
        ? payload.code
        : "";

    if (
      response.status === 409 ||
      payloadCode === "NICKNAME_TAKEN" ||
      payloadMessage.includes("UNIQUE constraint failed") ||
      payloadMessage.includes("SQLITE_CONSTRAINT")
    ) {
      setNicknameError(tErrors("nicknameTaken"));
      return;
    }

    setNicknameError(tErrors("joinFailed"));
  }

  return (
    <div className={styles.container}>
      <div className={styles.navigation} onClick={navigation.back}>
        <ArrowLeft />
        {cActions("back")}
      </div>
      <Card className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Title
            data-testid="title"
            align="center"
            size="large"
            as="h1"
            data-color="brand-purple"
            description={tNickname("description")}
          >
            {eventName ? `${tNickname("title")} ${eventName}` : tNickname("title")}
          </Title>
          <Input
            aria-label={cFields("nickname")}
            label={cFields("nickname")}
            placeholder={tNickname("placeholder")}
            name="name"
            value={nickname}
            onChange={e => {
              setNickname(e.target.value);
              if (nicknameError) setNicknameError("");
            }}
            error={nicknameError || undefined}
            required
          />
          <input hidden defaultValue={joinCode} name="eventCode" />
          <Button
            variant="primary"
            icon={<ArrowRight />}
            iconPosition="right"
            data-color="brand-purple"
            type="submit"
            fill
          >
            {cActions("join")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
