import { useEffect, useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, DropdownControls, Input, Switch } from "ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.options");

  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">("limited");

  useEffect(() => {
    if (limitMode === "unlimited") updateFormData("uploadLimit", undefined);
  }, [limitMode, updateFormData]);

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
                  value={formData.uploadLimit}
                  onChange={e =>
                    updateFormData("uploadLimit", Math.max(1, Number(e.target.value)))
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
    </>
  );
};

export default OptionsStep;
