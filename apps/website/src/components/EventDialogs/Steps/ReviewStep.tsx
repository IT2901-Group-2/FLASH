import { Title, QRDisplay, Button, Loader, SegmentedControl, TextField } from "@flash/ui";
import { useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { ReviewStepProps } from "./types";
import { useEventCodeQuery } from "@/hooks/useEvents";

const ReviewStep = ({ status, result }: ReviewStepProps) => {
  const tReview = useTranslations("admin.dashboard.event.create.review");
  const tCommon = useTranslations("common");

  const [shareRole, setShareRole] = useState<"guest" | "moderator">("guest");
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: displayCode } = useEventCodeQuery(
    result?.id,
    shareRole as "guest" | "moderator"
  );

  const displayLink = displayCode ? `${window.location.origin}/join/${displayCode}` : "";

  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg && displayCode) downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
  };

  if (status === "pending") return <Loader />;

  return (
    <>
      <Title size="medium" description={tReview("description")}>
        {tReview("title")}
      </Title>

      <SegmentedControl
        onChange={role => setShareRole(role as "guest" | "moderator")}
        value={shareRole}
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
          >
            {tCommon("actions.download")}
          </Button>
        </div>

        <div className={styles.linkContainer}>
          <Title
            size="medium"
            description={tReview("links.description", { role: shareRole })}
          >
            {tReview("links.title", { role: shareRole })}
          </Title>
          <TextField
            label="Link"
            hideLabel
            aria-label="Guest Link"
            readOnly
            value={displayLink}
          />
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
