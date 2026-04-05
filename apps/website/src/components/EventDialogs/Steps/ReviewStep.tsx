import { Title, QRDisplay, Button, Loader, SegmentedControl, TextField } from "@flash/ui";
import { useRef, useState } from "react";
import { Copy, CopyCheck, CopyX, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { useEventCodeQuery } from "@/hooks/useEvents";
import { Event } from "@/db";

export interface ReviewStepProps {
  status: "idle" | "pending" | "success" | "error";
  result: Event | null | undefined;
}

const ReviewStep = ({ status, result }: ReviewStepProps) => {
  const tReview = useTranslations("admin.dashboard.event.create.review");
  const tCommon = useTranslations("common");

  const [role, setRole] = useState<"guest" | "moderator">("guest");
  const [iconState, setIconState] = useState<React.ReactElement>(<Copy />);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: displayCode } = useEventCodeQuery(result?.id, role);

  const displayLink = displayCode ? `${window.location.origin}/join/${displayCode}` : "";

  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg && displayCode) downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard
      .writeText(displayLink)
      .then(() => setIconState(<CopyCheck />))
      .catch(() => setIconState(<CopyX />))
      .then(() => setTimeout(() => setIconState(<Copy />), 1000));
  };

  if (status === "pending") return <Loader />;

  return (
    <>
      <Title size="medium" description={tReview("description")}>
        {tReview("title")}
      </Title>

      <SegmentedControl
        onChange={role => setRole(role as "guest" | "moderator")}
        value={role}
        className={styles.scroll}
        fill
      >
        <SegmentedControl.Item label="Guest" value="guest" />
        <SegmentedControl.Item label="Moderator" value="moderator" />
      </SegmentedControl>

      <div className={styles.infoContainer}>
        <div className={styles.QRCodeContainer} ref={qrContainerRef}>
          <QRDisplay
            value={displayLink}
            code={displayCode}
            helperText={tCommon("messages.scanToUploadPhotos")}
          />
          <Button
            data-color="neutral"
            variant="secondary"
            icon={<Download />}
            onClick={handleDownloadQR}
            fill
          >
            {tCommon("actions.download")}
          </Button>
        </div>

        <div className={styles.linkContainer}>
          <Title size="medium" description={tReview("links.description", { role })}>
            {tReview("links.title", { role })}
          </Title>
          <div className={styles.copyContainer}>
            <TextField
              label="Link"
              hideLabel
              aria-label="Guest Link"
              readOnly
              value={displayLink}
            />
            <Button
              variant="icon"
              icon={iconState}
              radius="16"
              onClick={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
