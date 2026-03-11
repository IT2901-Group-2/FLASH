"use client";
import { TextAlignStart } from "lucide-react";
import { Card, TextField, Button, Title, DropdownControl } from "ui";
import { useTranslations } from "next-intl";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/lib/utils/api";
import { getEventCodeSchema } from "@/db";
import { FieldValues, useForm } from "react-hook-form";

const JoinEventCard = () => {
  const router = useRouter();
  const t = useTranslations("");
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleJoin = useCallback(
    async (e: FieldValues) => {
      const code = e.eventCode;
      if (typeof code !== "string") return;

      await makeRequest(getEventCodeSchema, `/api/events/by-code/${code}`)
        .then(() => router.push(`/join/${code}`))
        .catch(() => setError("Invalid code"));
    },
    [router]
  );

  return (
    <Card>
      <Title
        size="medium"
        align="center"
        description={t("pages.joinEvent.description")}
        as="h2"
      >
        {t("pages.joinEvent.title")}
      </Title>
      <DropdownControl className={styles.dropdownControls} defaultValue="enter-code">
        <DropdownControl.Item
          value="enter-code"
          label={t("guest.login.card.tabs.enterCode")}
          content={
            <form className={styles.content} onSubmit={handleSubmit(handleJoin)}>
              <TextField
                label={t("common.fields.eventCode")}
                placeholder={t("guest.login.card.fields.eventCode.placeholder")}
                icon={<TextAlignStart />}
                aria-label={t("common.fields.eventCode")}
                type="text"
                data-color="brand-purple"
                onKeyDown={() => setError("")}
                error={errors.eventCode?.message?.toString() || error}
                {...register("eventCode", {
                  required: "Plese fill in a code",
                })}
                required
              />
              <Button
                className={styles.fullWidthButton}
                data-color="brand-purple"
                type="submit"
                fill
              >
                {t("common.actions.join")}
              </Button>
            </form>
          }
        />
        <DropdownControl.Item
          value="scan-qr"
          label={t("guest.login.card.tabs.scanQr")}
          content={
            <div className={styles.content}>
              <div className={styles.qrContainer}>
                <QrCode size={64} />
              </div>
              <p className={styles.qrText}>{t("guest.login.card.scanQr.description")}</p>
              <Button
                className={styles.fullWidthButton}
                variant="secondary"
                data-color="brand-purple"
                fill
              >
                {t("common.actions.openCamera")}
              </Button>
            </div>
          }
        />
      </DropdownControl>
      <span>
        {t("guest.login.card.links.adminAccessPrefix")}{" "}
        <Link role="link" href={"/admin"}>
          {t("common.roles.admin")}
        </Link>
        .
      </span>
    </Card>
  );
};

export default JoinEventCard;
