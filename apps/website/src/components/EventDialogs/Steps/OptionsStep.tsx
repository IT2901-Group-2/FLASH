import { useEffect, useState } from "react";
import { Title, DropdownControl, Switch, TextField } from "@flash/ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";
import { FormValues } from "../types";

export const OptionsStep = () => {
  const tStep = useTranslations("admin.dashboard.event.create.options");
  const tFields = useTranslations("common.fields");

  const { register, control, watch, setValue } = useFormContext<FormValues>();
  const { errors } = useFormState({ control });

  const uploadLimit = watch("uploadLimit");
  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">(
    uploadLimit === undefined ? "unlimited" : "limited"
  );

  useEffect(() => {
    if (limitMode === "unlimited") setValue("uploadLimit", undefined);
  }, [limitMode, setValue]);

  return (
    <>
      <Title description={tStep("description")}>{tStep("title")}</Title>
      <DropdownControl
        value={limitMode}
        onChange={v => setLimitMode(v as typeof limitMode)}
        dropdownBorder
      >
        <DropdownControl.Item
          value="limited"
          label={tStep("fields.uploadLimit.limited")}
          content={
            <div className={styles.maxImageContainer}>
              <span>{tStep("fields.uploadLimit.label")}</span>
              <TextField
                label
                hideLabel
                {...register("uploadLimit", {
                  min: { value: 1, message: "This has to be at least 1" },
                })}
                error={errors.uploadLimit?.message}
                aria-label={tFields("maxImages")}
                type="number"
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
