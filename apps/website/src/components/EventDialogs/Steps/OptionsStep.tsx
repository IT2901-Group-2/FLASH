import { useEffect, useState } from "react";
import { StepProps } from "./types";
import { Title, DropdownControl, Input, Switch } from "ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.options");

  const [limitMode, setLimitMode] = useState<string>(
    formData.uploadLimit === undefined ? "unlimited" : "limited"
  );

  useEffect(() => {
    if (limitMode === "unlimited") updateFormData("uploadLimit", undefined);
  }, [limitMode, updateFormData]);

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <DropdownControl value={limitMode} onChange={setLimitMode} dropdownBorder>
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
                required={limitMode == "limited"}
              />
            </div>
          }
        />
        <DropdownControl.Item value="unlimited" label={t("input.uploads.unlimited")} />
      </DropdownControl>
      {/* // TODO: When database is updated, uncomment these */}
      <Switch
        position="right"
        // checked={formData.autoApprove}
        // onChange={(checked: boolean) => updateFormData("autoApprove", checked)}
      >
        <b>{t("input.autoApprove")}</b>
      </Switch>
      <Switch
        position="right"
        // checked={formData.seeAllPictures}
        // onChange={(checked: boolean) => updateFormData("seeAllPictures", checked)}
      >
        <b>{t("input.guestSeeAll")}</b>
      </Switch>
    </>
  );
};

export default OptionsStep;
