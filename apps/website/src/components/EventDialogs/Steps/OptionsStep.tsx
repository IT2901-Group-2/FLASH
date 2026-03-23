import { useEffect, useState } from "react";
import { StepProps } from "./types";
import { Title, DropdownControl, Input, Switch } from "@flash/ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const tStep = useTranslations("admin.dashboard.event.create.options");
  const tFields = useTranslations("common.fields");

  const [limitMode, setLimitMode] = useState<string>(
    formData.uploadLimit === undefined ? "unlimited" : "limited"
  );

  useEffect(() => {
    if (limitMode === "unlimited") updateFormData("uploadLimit", undefined);
  }, [limitMode, updateFormData]);

  return (
    <>
      <Title description={tStep("description")}>{tStep("title")}</Title>
      <DropdownControl value={limitMode} onChange={setLimitMode} dropdownBorder>
        <DropdownControl.Item
          value="limited"
          label={tStep("fields.uploadLimit.limited")}
          content={
            <div className={styles.maxImageContainer}>
              <span>{tStep("fields.uploadLimit.label")}</span>
              <Input
                aria-label={tFields("maxImages")}
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
        <DropdownControl.Item
          value="unlimited"
          label={tStep("fields.uploadLimit.unlimited")}
        />
      </DropdownControl>
      {/* // TODO: When database is updated, uncomment these */}
      <Switch
        position="right"
        // checked={formData.autoApprove}
        // onChange={(checked: boolean) => updateFormData("autoApprove", checked)}
      >
        <b>{tStep("fields.autoApprovePhotos")}</b>
      </Switch>
      <Switch
        position="right"
        // checked={formData.seeAllPictures}
        // onChange={(checked: boolean) => updateFormData("seeAllPictures", checked)}
      >
        <b>{tStep("fields.guestCanViewAll")}</b>
      </Switch>
    </>
  );
};

export default OptionsStep;
