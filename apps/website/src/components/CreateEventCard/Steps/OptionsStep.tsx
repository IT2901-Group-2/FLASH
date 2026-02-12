import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, DropdownControls, Input, Switch } from "ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.options");

  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">("limited");
  const [autoGenerateCode, setAutoGenerateCode] = useState<boolean>(true);

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <DropdownControls
        onChange={setLimitMode}
        options={[
          {
            content: (
              <div className={styles.maxImageContainer}>
                <span>{t("input.uploads.title")}</span>
                <Input
                  aria-label="maxImages"
                  type="number"
                  min={1}
                  value={formData.photosPerGuest}
                  onChange={e =>
                    updateFormData(
                      "photosPerGuest",
                      limitMode === "limited" ? e.target.value : 9999
                    )
                  }
                />
              </div>
            ),
            label: t("input.uploads.limited"),
            value: "limited",
          },
          {
            label: t("input.uploads.unlimited"),
            value: "unlimited",
          },
        ]}
      />
      <Switch position="right">
        <b>{t("input.autoApprove")}</b>
      </Switch>
      <Switch
        position="right"
        checked={autoGenerateCode}
        onChange={e => setAutoGenerateCode(e.target.checked)}
      >
        <b>{t("input.autoGenerate")}</b>
      </Switch>
      {!autoGenerateCode && (
        <Input
          visualSize="small"
          label="Custom Entry Code"
          aria-label="manualCode"
          onChange={e => updateFormData("code", e.target.value)}
        />
      )}
    </>
  );
};

export default OptionsStep;
