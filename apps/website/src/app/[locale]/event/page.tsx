"use client";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, PhoneHeader } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";

export default function Page() {
  const eventName = "Event Name"; // This should be dynamically fetched based on the event the guest is joining
  const nickname = "GuestNickname"; // This should be dynamically fetched based on the guest's information
  const uploadsRemaining = 5; // This should be dynamically fetched based on the guest's upload status

  const { openFilePicker, FileInput } = useFileUpload({
    onFilesSelected: files => {
      console.log("Selected files:", files);
      // TODO: Handle file upload logic here
    },
  });

  return (
    <div className={styles.pageWrapper}>
      <FileInput />
      <PhoneHeader
        title={eventName}
        subtitle={nickname}
        rightLabel="Live"
        rightVariant="primary"
        rightAriaLabel="live-button"
        leftIcon={<ArrowLeft />}
        leftAriaLabel="back-button"
        uploadsRemaining={uploadsRemaining}
        onPrimaryClick={openFilePicker}
      ></PhoneHeader>
      <ActionCard
        className={styles.mobileOnly}
        primaryButton={{
          "data-color": "brand-purple",
          icon: <Upload size={18} />,
          iconPosition: "right",
          text: "Upload Image",
          onClick: openFilePicker,
        }}
        secondaryButton={{
          "data-color": "brand-purple",
          icon: <Camera size={18} />,
          iconPosition: "right",
          text: "Take Photo",
        }}
      />
    </div>
  );
}
