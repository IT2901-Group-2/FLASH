import { Calendar } from "lucide-react";
import { Title, TextField, Textarea } from "ui";
import { useTranslations } from "next-intl";
import { StepProps } from "./types";
import styles from "./Steps.module.css";
import {
  formatDateForInput,
  formatTimeForInput,
  makeDateTimeHandler,
} from "@/utils/date-utils";
import { useForm } from "react-hook-form";

export const BasicInfoStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations();

  const startDateValue = formData.startDate.toISOString().split("T")[0];

  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Title description={t("admin.dashboard.event.create.basics.description")}>
        {t("admin.dashboard.event.create.basics.title")}
      </Title>
      <TextField
        label={t("common.fields.eventName")}
        aria-label={t("common.fields.eventName")}
        {...register("name", {
          maxLength: { value: 255, message: "" }, //TODO
          required: "", //TODO
        })}
        required
        data-testid="name"
      />
      <Textarea
        value={formData.description}
        {...register("descriprion")}
        label={t("common.fields.eventDescription")}
        aria-label={t("common.fields.eventDescription")}
        data-testid="description"
        resize="vertical"
      />
      <div className={styles.timeContainer}>
        <TextField
          value={formatDateForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "date", formData, updateFormData)}
          label={t("common.fields.startDate")}
          aria-label={t("common.fields.startDate")}
          icon={<Calendar />}
          required
          data-testid="startDate"
          // fill
        />
        <TextField
          value={formatTimeForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "time", formData, updateFormData)}
          label={t("common.fields.startTime")}
          aria-label={t("common.fields.startTime")}
          type="time"
          icon={<Calendar />}
          required
        />
        <TextField
          label={"Duration"}
          aria-label={t("common.fields.endDate")}
          min={startDateValue}
          icon={<Calendar />}
          required
          data-testid="endDate"
          // fill
        />
      </div>
    </>
  );
};
export default BasicInfoStep;
