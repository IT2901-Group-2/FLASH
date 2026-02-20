import { Calendar } from "lucide-react";
import { Title, Input } from "ui";
import { StepProps } from "../CreateEventCard";
import { useTranslations } from "next-intl";

export const BasicInfoStep = ({ formData, updateFormData }: StepProps) => {
  const t = useTranslations("admin.dashboard.event.create.basicInfo");

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <Input
        value={formData.name}
        onChange={e => updateFormData("name", e.target.value)}
        label={t("input.name")}
        aria-label="eventName"
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
      />
      <Input
        value={formData.endDate.toISOString().split("T")[0]}
        onChange={e => updateFormData("endDate", new Date(e.target.value))}
        label={t("input.endDate")}
        aria-label="eventEndDate"
        type="date"
        icon={<Calendar />}
      />
    </>
  );
};
export default BasicInfoStep;
