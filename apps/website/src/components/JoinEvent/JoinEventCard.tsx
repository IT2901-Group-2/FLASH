"use client";
import { ChartNoAxesGantt } from "lucide-react";
import { Card, Input, Button, Title, DropdownControls, QRDisplay } from "ui";
import styles from "./JoinEventCard.module.css";

const JoinEventCard = () => {
  return (
    <Card data-color="background-secondary">
      <Title align="center" description="Enter the event code or scan the QR code to join" as="h2">
        Join an Event
      </Title>
      <DropdownControls
        className={styles.dropdownControls}
        defaultValue="enter-code"
        options={[
          {
            content: (
              <div className={styles.content}>
                <Input
                  label="Event code"
                  placeholder="Enter event code... e.g. 245033"
                  icon={<ChartNoAxesGantt size={24} />}
                  aria-label={"event code"}
                />
                <Button className={styles.fullWidthButton} data-color="brand-purple">Join Event</Button>
              </div>
            ),
            label: "Enter code",
            value: "enter-code",
          },
          {
            content: (
                <div className={styles.content}>
                     {/* TODO: Replace the hardcoded value with a dynamic one based on the event */}
                    <div className={styles.qrContainer}>
                      <QRDisplay value="https://example.com/upload" />
                    </div>
                    <Button className={styles.fullWidthButton} variant="secondary" data-color="brand-purple">Open Camera</Button>
                </div>
            ),
            label: "Scan QR",
            value: "scan-qr",
          },
        ]}
      ></DropdownControls>
    </Card>
  );
};

export default JoinEventCard;
