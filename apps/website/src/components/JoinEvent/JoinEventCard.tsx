"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControls, QRDisplay } from "ui";
import { useTranslations } from "next-intl";
import styles from "./JoinEventCard.module.css";

const JoinEventCard = () => {
  const t = useTranslations("JoinEvent");

  return (
    <Card data-color="background-secondary">
      <Title align="center" description={t("description")} as="h2">
        {t("title")}
      </Title>
      <DropdownControls
        className={styles.dropdownControls}
        defaultValue="enter-code"
        options={[
          {
            content: (
              <div className={styles.content}>
                <Input
                  label={t("eventCodeLabel")}
                  placeholder={t("eventCodePlaceholder")}
                  icon={<TextAlignStart size={24} />}
                  aria-label={t("eventCodeLabel")}
                />
                <Button className={styles.fullWidthButton} data-color="brand-purple">
                  {t("joinButton")}
                </Button>
              </div>
            ),
            label: t("enterCodeTab"),
            value: "enter-code",
          },
          {
            content: (
              <div className={styles.content}>
                {/* TODO: Replace the hardcoded value with a dynamic one based on the event */}
                <div className={styles.qrContainer}>
                  <QRDisplay value="https://example.com/upload" />
                </div>
                <Button
                  className={styles.fullWidthButton}
                  variant="secondary"
                  data-color="brand-purple"
                >
                  {t("openCameraButton")}
                </Button>
              </div>
            ),
            label: t("scanQrTab"),
            value: "scan-qr",
          },
        ]}
      ></DropdownControls>
    </Card>
  );
};

export default JoinEventCard;
