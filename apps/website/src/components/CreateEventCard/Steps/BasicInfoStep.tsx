import { Calendar } from "lucide-react";
import { Title, Input } from "ui";
import { StepProps } from "../CreateEventCard";

export const BasicInfoStep = ({ formData, updateFormData }: StepProps) => {
  return (
    <>
      <Title description="Set up a new photo event for your guests. A QR code will be generated automatically.">
        Create Event Name
      </Title>
      <Input
        value={formData.name}
        onChange={e => updateFormData("name", e.target.value)}
        label="Event Name"
        aria-label="eventName"
      />
      <Input
        value={formData.description}
        onChange={e => updateFormData("description", e.target.value)}
        label="Event Description"
        aria-label="eventDescription"
      />
      <Input
        value={formData.date}
        onChange={e => updateFormData("date", e.target.value)}
        label="Event Date"
        aria-label="eventDate"
        type="date"
        icon={<Calendar />}
      />
    </>
  );
};
export default BasicInfoStep;
