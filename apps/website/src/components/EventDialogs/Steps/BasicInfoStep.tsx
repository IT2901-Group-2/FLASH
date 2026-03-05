import { Calendar } from "lucide-react";
import { Title, Input } from "ui";
import { useTranslations } from "next-intl";
import { StepProps } from "./types";
import styles from "./Steps.module.css";
import {
  formatDateForInput,
  formatTimeForInput,
  makeDateTimeHandler,
} from "@/utils/date-utils";

export const BasicInfoStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.basicInfo");

  const startDateValue = formData.startDate.toISOString().split("T")[0];

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <Input
        value={formData.name}
        onChange={e => updateFormData("name", e.target.value)}
        label={t("input.name")}
        aria-label="eventName"
        minLength={3}
        required
        data-testid="name"
      />
      <Input
        value={formData.description}
        onChange={e => updateFormData("description", e.target.value)}
        label={t("input.description")}
        aria-label="eventDescription"
        data-testid="description"
      />
      <div className={styles.timeContainer}>
        <Input
          value={formatDateForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "date", formData, updateFormData)}
          label={t("input.startDate")}
          aria-label="eventStartDate"
          type="date"
          icon={<Calendar />}
          required
          data-testid="startDate"
          fill
        />
        <Input
          value={formatTimeForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "time", formData, updateFormData)}
          label={t("input.startTime")}
          aria-label="eventStartDate"
          type="time"
          icon={<Calendar />}
          required
        />
        <Input
          value={formatDateForInput(formData.endDate)}
          onChange={makeDateTimeHandler("endDate", "date", formData, updateFormData)}
          label={t("input.endDate")}
          aria-label="eventEndDate"
          min={startDateValue}
          type="date"
          icon={<Calendar />}
          required
          data-testid="endDate"
          fill
        />
        <Input
          value={formatTimeForInput(formData.endDate)}
          onChange={makeDateTimeHandler("endDate", "time", formData, updateFormData)}
          label={t("input.endTime")}
          aria-label="eventStartDate"
          type="time"
          icon={<Calendar />}
          required
        />
      </div>
    </>
  );
};
export default BasicInfoStep;
