"use client";
import { Button, Card, Input, Title } from "ui";
import styles from "./nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEventByCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { truncateText } from "@/utils/string-utils";

export default function Page() {
  const navigation = useRouter();
  const tNickname = useTranslations("guest.login.card.nickname");
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

  return (
    <div className={styles.container}>
      <div className={styles.navigation} onClick={navigation.back}>
        <ArrowLeft />
        {cActions("back")}
      </div>
      <Card className={styles.card}>
        <form className={styles.form} action="/api/join" method="POST">
          <Title
            data-testid="title"
            align="center"
            size="large"
            as="h1"
            data-color="brand-purple"
            description={tNickname("description")}
          >
            {eventName
              ? `${tNickname("title")} ${truncateText(eventName, 30)}`
              : tNickname("title")}
          </Title>
          <Input
            aria-label={cFields("nickname")}
            label={cFields("nickname")}
            placeholder={tNickname("placeholder")}
            name="name"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
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
