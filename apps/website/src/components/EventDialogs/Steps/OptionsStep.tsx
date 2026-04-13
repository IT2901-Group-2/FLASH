import { useEffect, useState } from "react";
import { Title, DropdownControl, Switch, TextField } from "@flash/ui";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { CreateEvent } from "@/db";

type OptionsFormData = {
  autoApprove: boolean;
  uploadsArePrivate: boolean;
};

export const OptionsStep = () => {
  const t = useTranslations("admin.dashboard.event.options");

  const { register, control, watch, setValue } = useFormContext<CreateEvent>();
  const { errors } = useFormState({ control });

  const uploadLimit = watch("uploadLimit");
  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">(
    uploadLimit === null ? "unlimited" : "limited"
  );
  const [formData, setFormData] = useState<OptionsFormData>({
    autoApprove: false,
    uploadsArePrivate: false,
  });

  const updateFormData = (key: keyof OptionsFormData, value: boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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
                required={limitMode === "limited"}
              />
            </div>
          }
        />
        <DropdownControl.Item
          value="unlimited"
          label={t("fields.uploadLimit.value.unlimited")}
        />
      </DropdownControl>
      <Controller
        control={control}
        name="autoApprove"
        defaultValue={false}
        render={({ field }) => (
          <Switch
            position="right"
            description={t("fields.autoApprovePhotos.description")}
            checked={field.value}
            onChange={e => field.onChange(e.target.checked)}
          >
            <b>{t("fields.autoApprovePhotos.title")}</b>
          </Switch>
        )}
      />
      <Controller
        control={control}
        name="uploadsArePrivate"
        defaultValue={false}
        render={({ field }) => (
          <Switch
            position="right"
            description={t("fields.guestCanViewAll.description")}
            checked={field.value}
            onChange={e => field.onChange(e.target.checked)}
          >
            <b>{t("fields.guestCanViewAll.title")}</b>
          </Switch>
        )}
      />{" "}
    </>
  );
};

export default OptionsStep;
