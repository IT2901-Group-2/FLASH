"use client";
import { useState } from "react";
import { Copy, Check, CircleAlert } from "lucide-react";
import { Title, Controls, QRDisplay, Input } from "ui";
import styles from "./ShareEvent.module.css";

export default function Page() {
  const [shareRole, setShareRole] = useState<"guest" | "moderator">("guest");
  const [copied, setCopied] = useState(false);

  const eventId = "abc123"; // TODO: Replace with actual event ID
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}/${shareRole}`;
  const displayCode = `${eventId.toUpperCase()}-${shareRole.substring(0, 1).toUpperCase()}`;

  const linkContent =
    shareRole === "guest"
      ? {
          title: "Guest Link",
          description:
            "Everyone with the link below will be able to upload images to this event",
        }
      : {
          title: "Moderator Link",
          description:
            "Everyone with the link below will be able to moderate all uploaded images",
        };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className={styles.pageWrapper}>
      <Title
        align="left"
        size="medium"
        as="h2"
        data-color="brand-purple"
        description="You can share the QR code or send them the link in order for others to join the event and upload images"
      >
        Let others join
      </Title>

      <div style={{ alignSelf: "center" }}>
        <Controls
          options={[
            { value: "guest", label: "Guest" },
            { value: "moderator", label: "Moderator" },
          ]}
          value={shareRole}
          onChange={setShareRole}
          variant="primary"
          data-color="accent"
        />
      </div>

      <div style={{ alignSelf: "center", margin: "0.5rem 0 0.25rem" }}>
        <QRDisplay value={shareUrl} code={displayCode} />
      </div>

      <Title
        align="left"
        size="medium"
        as="h2"
        data-color="brand-purple"
        description={linkContent.description}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
          {linkContent.title}
          {shareRole === "moderator" && (
            <CircleAlert
              size={18}
              aria-label="moderator link alert"
              style={{ color: "var(--color-warning-600)" }}
            />
          )}
        </span>
      </Title>

      <div style={{ alignSelf: "center", width: "100%", maxWidth: "21.375rem" }}>
        <Input
          aria-label={`${shareRole}-link`}
          value={shareUrl}
          readOnly
          visualSize="large"
          data-color="accent"
          icon={
            copied ? (
              <Check size={18} aria-label="copied" style={{ cursor: "pointer" }} />
            ) : (
              <Copy
                size={18}
                aria-label="copy-link"
                style={{ cursor: "pointer" }}
                onClick={handleCopy}
              />
            )
          }
          iconPosition="right"
        />
      </div>
    </div>
  );
}
