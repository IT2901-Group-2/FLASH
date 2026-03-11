"use client";
import { Button, Card, TextField, Title } from "ui";
import styles from "./nickname.module.css";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const navigation = useRouter();
  const t = useTranslations("guest.nickname");
  const { code } = useParams<{ code: string }>();

  const [nickname, setNickname] = useState<string>("");

  return (
    <div className={styles.container}>
      <div className={styles.navigation} onClick={navigation.back}>
        <ArrowLeft />
        {t("back")}
      </div>
      <Card className={styles.card}>
        <form className={styles.form} action="/api/join" method="POST">
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
          <TextField
            aria-label="nickname-input"
            label={t("input.title")}
            placeholder={t("input.placeholder")}
            name="name"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
          />
          <input hidden defaultValue={code} name="eventCode" />
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
