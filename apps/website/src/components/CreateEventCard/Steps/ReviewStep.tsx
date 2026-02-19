import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, Controls, QRDisplay, Button, Input, Loader } from "ui";
import { Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

const ReviewStep = ({ status, result }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.review");
  const [view, setView] = useState<string>("guest");

  if (status === "pending") return <Loader />;

  return (
    <>
      <Title size="medium" description={t("description")}>
        {t("title")}
      </Title>
      <Controls
        onChange={setView}
        value={view}
        options={[
          { label: t("guest.name"), value: "guest" },
          { label: t("moderator.name"), value: "moderator" },
        ]}
      />
      <div className={styles.infoContainer}>
        <div className={styles.QRCodeContainer}>
          <QRDisplay
            value={`${window.location.origin}/${result?.guestCode}`}
            code={`${result?.guestCode}`}
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
            value={`${window.location.origin}/${result?.guestCode}`}
            icon={<Copy />}
            iconPosition="right"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
