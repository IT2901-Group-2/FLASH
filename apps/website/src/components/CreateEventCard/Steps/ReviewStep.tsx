import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, SegmentedControl, QRDisplay, Button, Input } from "ui";
import { generateRandomString } from "@/utils/string-utils";
import { Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

const ReviewStep = ({ formData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.review");

  // TODO: When endpoint is made, make this load until data is fetched.
  const [view, setView] = useState<string>("guest");

  return (
    <>
      <Title size="medium" description={t("description")}>
        {t("title")}
      </Title>
      <SegmentedControl onChange={setView} value={view} fill>
        <SegmentedControl.Item label={t("guest.name")} value="guest" />
        <SegmentedControl.Item label={t("moderator.name")} value="moderator" />
      </SegmentedControl>
      <div className={styles.infoContainer}>
        <div className={styles.QRCodeContainer}>
          <QRDisplay
            value={"www.example.com"}
            code={`${formData.code || generateRandomString(5)}${view === "moderator" ? "-MOD" : ""}`}
          />
          <Button variant="secondary" icon={<Download />}>
            {t("download")}
          </Button>
        </div>
        <div className={styles.linkContainer}>
          <Title size="medium" description={t("guest.linkDescription")}>
            {t("guest.linkTitle")}
          </Title>
          <Input
            aria-label="link"
            readOnly
            value={"www.example.com"}
            icon={<Copy />}
            iconPosition="right"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
