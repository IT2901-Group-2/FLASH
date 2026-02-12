import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, Controls, QRDisplay, Button, Input } from "ui";
import { generateRandomString } from "@/utils/string-utils";
import { Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";

const ReviewStep = ({ formData }: StepProps) => {
  // TODO: When endpoint is made, make this load until data is fetched.
  const [view, setView] = useState<string>("guest");

  return (
    <>
      <Title
        size="medium"
        description="You can share the QR code or send them the link in order for others to join the event and upload images."
      >
        Let others join!
      </Title>
      <Controls
        onChange={setView}
        value={view}
        options={[
          { label: "Guest", value: "guest" },
          { label: "Moderator", value: "moderator" },
        ]}
      />
      <div className={styles.infoContainer}>
        <div className={styles.QRCodeContainer}>
          <QRDisplay
            value={"www.example.com"}
            code={`${formData.code || generateRandomString(5)}${view === "moderator" ? "-MOD" : ""}`}
          />
          <Button variant="secondary" icon={<Download />}>
            Download
          </Button>
        </div>
        <div className={styles.linkContainer}>
          <Title
            size="medium"
            description="Everyone with the link below will be able to uploaded images to this event"
          >
            Guest Link
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
