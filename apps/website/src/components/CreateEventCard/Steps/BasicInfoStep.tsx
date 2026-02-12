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
        value={formData.date}
        onChange={e => updateFormData("date", e.target.value)}
        label={t("input.date")}
        aria-label="eventDate"
        type="date"
        icon={<Calendar />}
      />
    </>
  );
};
export default BasicInfoStep;
