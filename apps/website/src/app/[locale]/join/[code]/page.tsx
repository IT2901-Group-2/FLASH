"use client";
import { Button, Card, Input, Title } from "@flash/ui";
import styles from "./nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useEventByCodeQuery, useEventsQuery, useJoinMutation } from "@/hooks/useEvents";

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
  const joinMutation = useJoinMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const { redirectUrl } = await joinMutation.mutateAsync(
        new FormData(event.currentTarget)
      );
      window.location.assign(redirectUrl);
    } catch (error) {
      if (error instanceof Error && error.message === "NICKNAME_TAKEN") {
        setNicknameError(tErrors("nicknameTaken"));
        return;
      }

      setNicknameError(tErrors("joinFailed"));
    }
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
            disabled={joinMutation.isPending}
            fill
          >
            {cActions("join")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
