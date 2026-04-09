import { useEffect, useState } from "react";
import { Title, DropdownControl, Switch, TextField } from "@flash/ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { useFormContext, useFormState } from "react-hook-form";
import { CreateEvent } from "@/db";

export const OptionsStep = () => {
  const t = useTranslations("admin.dashboard.event.options");

  const { register, control, watch, setValue } = useFormContext<CreateEvent>();
  const { errors } = useFormState({ control });

  const uploadLimit = watch("uploadLimit");
  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">(
    uploadLimit === null ? "unlimited" : "limited"
  );

  useEffect(() => {
    if (limitMode === "unlimited") setValue("uploadLimit", null);
  }, [limitMode, setValue]);

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <DropdownControl
        label={t("fields.uploadLimit.title")}
        description={t("fields.uploadLimit.description")}
        value={limitMode}
        onChange={v => setLimitMode(v as typeof limitMode)}
        dropdownBorder
        data-testid="dropdown-control"
      >
        <DropdownControl.Item
          value="limited"
          label={t("fields.uploadLimit.value.limited")}
          content={
            <div className={styles.maxImageContainer}>
              <span>{t("fields.uploadLimit.value.maxUploads")}</span>
              <TextField
                label
                hideLabel
                {...register("uploadLimit", {
                  valueAsNumber: true,
                  min: { value: 1, message: t("fields.uploadLimit.error.min") },
                  required:
                    limitMode === "limited"
                      ? t("fields.uploadLimit.error.required")
                      : false,
                })}
                error={errors.uploadLimit?.message}
                type="number"
                required={limitMode == "limited"}
              />
            </div>
          }
        />
        <DropdownControl.Item
          value="unlimited"
          label={t("fields.uploadLimit.value.unlimited")}
        />
      </DropdownControl>
      {/* // TODO: When database is updated, uncomment these */}
      <Switch
        position="right"
        description={t("fields.autoApprovePhotos.description")}
        // checked={formData.autoApprove}
        // onChange={(checked: boolean) => updateFormData("autoApprove", checked)}
      >
        <b>{t("fields.autoApprovePhotos.title")}</b>
      </Switch>
      <Switch
        position="right"
        description={t("fields.guestCanViewAll.description")}
        // checked={formData.seeAllPictures}
        // onChange={(checked: boolean) => updateFormData("seeAllPictures", checked)}
      >
        <b>{t("fields.guestCanViewAll.title")}</b>
      </Switch>
    </>
  );
};

export default OptionsStep;
