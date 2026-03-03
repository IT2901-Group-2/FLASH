import { Calendar } from "lucide-react";
import { Title, Input } from "ui";
import { useTranslations } from "next-intl";
import { StepProps } from "./types";

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
      />
      <Input
        value={formData.description}
        onChange={e => updateFormData("description", e.target.value)}
        label={t("input.description")}
        aria-label="eventDescription"
      />
      <Input
        value={formData.startDate.toISOString().split("T")[0]}
        onChange={e => updateFormData("startDate", new Date(e.target.value))}
        label={t("input.startDate")}
        aria-label="eventStartDate"
        type="date"
        icon={<Calendar />}
        required
      />
      <Input
        value={formData.endDate.toISOString().split("T")[0]}
        onChange={e => updateFormData("endDate", new Date(e.target.value))}
        label={t("input.endDate")}
        aria-label="eventEndDate"
        min={startDateValue}
        type="date"
        icon={<Calendar />}
        required
      />
    </>
  );
};
export default BasicInfoStep;
