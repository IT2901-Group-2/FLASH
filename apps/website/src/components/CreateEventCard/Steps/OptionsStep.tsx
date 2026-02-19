import { useEffect, useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, DropdownControl, Input, Switch } from "ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.options");

  const [limitMode, setLimitMode] = useState<string>("limited");

  useEffect(() => {
    if (limitMode === "unlimited") updateFormData("uploadLimit", undefined);
  }, [limitMode, updateFormData]);

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
                value={formData.uploadLimit}
                onChange={e =>
                  updateFormData("uploadLimit", Math.max(1, Number(e.target.value)))
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
    </>
  );
};

export default OptionsStep;
