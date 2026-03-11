import { Calendar } from "lucide-react";
import { Title, TextField } from "ui";
import { useTranslations } from "next-intl";
import { StepProps } from "./types";
import styles from "./Steps.module.css";
import {
  formatDateForInput,
  formatTimeForInput,
  makeDateTimeHandler,
} from "@/utils/date-utils";

export const BasicInfoStep = ({ formData, updateFormData }: StepProps) => {
  const tStep = useTranslations("admin.dashboard.event.create.basics");
  const tFields = useTranslations("common.fields");

  const startDateValue = formData.startDate.toISOString().split("T")[0];

  return (
    <>
      <Title description={tStep("description")}>{tStep("title")}</Title>
      <TextField
        value={formData.name}
        onChange={e => updateFormData("name", e.target.value)}
        label={tFields("eventName")}
        aria-label={tFields("eventName")}
        minLength={3}
        required
        data-testid="name"
      />
      <TextField
        value={formData.description}
        onChange={e => updateFormData("description", e.target.value)}
        label={tFields("eventDescription")}
        aria-label={tFields("eventDescription")}
        data-testid="description"
      />
      <div className={styles.timeContainer}>
        <TextField
          value={formatDateForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "date", formData, updateFormData)}
          label={tFields("startDate")}
          aria-label={tFields("startDate")}
          icon={<Calendar />}
          required
          data-testid="startDate"
          // fill
        />
        <TextField
          value={formatTimeForInput(formData.startDate)}
          onChange={makeDateTimeHandler("startDate", "time", formData, updateFormData)}
          label={tFields("startTime")}
          aria-label={tFields("startTime")}
          type="time"
          icon={<Calendar />}
          required
        />
        <TextField
          value={formatDateForInput(formData.endDate)}
          onChange={makeDateTimeHandler("endDate", "date", formData, updateFormData)}
          label={tFields("endDate")}
          aria-label={tFields("endDate")}
          min={startDateValue}
          // type="date"
          icon={<Calendar />}
          required
          data-testid="endDate"
          // fill
        />
        <TextField
          value={formatTimeForInput(formData.endDate)}
          onChange={makeDateTimeHandler("endDate", "time", formData, updateFormData)}
          label={tFields("endTime")}
          aria-label={tFields("endTime")}
          type="time"
          icon={<Calendar />}
          required
        />
      </div>
    </>
  );
};
export default BasicInfoStep;
