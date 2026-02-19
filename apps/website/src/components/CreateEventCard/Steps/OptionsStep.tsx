import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, DropdownControl, Input, Switch } from "ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.options");

  const [limitMode, setLimitMode] = useState<string>("limited");
  const [autoGenerateCode, setAutoGenerateCode] = useState<boolean>(true);

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <DropdownControl value={limitMode} onChange={setLimitMode}>
        <DropdownControl.Item
          value="limited"
          label={t("input.uploads.limited")}
          content={
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
                    limitMode === "limited" ? e.currentTarget.value : Infinity
                  )
                }
              />
            </div>
          }
        />
        <DropdownControl.Item value="unlimited" label={t("input.uploads.unlimited")} />
      </DropdownControl>
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
