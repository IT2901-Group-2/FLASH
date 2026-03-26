import { Title, TextField, Textarea, DatePicker } from "@flash/ui";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useFormState, useWatch } from "react-hook-form";
import { FormValues } from "../types";
import EventTimeField from "../TimeField";

export const BasicInfoStep = () => {
  const tStep = useTranslations("admin.dashboard.event.create.basics");
  const tFields = useTranslations("common.fields");

  const { register, control } = useFormContext<FormValues>();
  const dateRange = useWatch({ control, name: "dateRange" });
  const { errors } = useFormState({ control });

  return (
    <>
      <Title description={tStep("description")}>{tStep("title")}</Title>
      <TextField
        {...register("name", {
          required: "This is required",
          minLength: { value: 3, message: "The title has to be at least 3 charachters." },
        })}
        error={errors.name?.message}
        label={tFields("eventName")}
        aria-label={tFields("eventName")}
        required
        data-testid="name"
        autoFocus
      />
      <Textarea
        {...register("description")}
        error={errors.description?.message}
        label={tFields("eventDescription")}
        aria-label={tFields("eventDescription")}
        data-testid="description"
        resize="vertical"
        maxRows={10}
      />
      <Controller
        name="dateRange"
        control={control}
        rules={{
          validate: v => !!(v.startDate && v.endDate) || "Both dates are required",
        }}
        render={({ field }) => (
          <DatePicker
            label="Date range"
            data-color="accent"
            value={field.value}
            onChange={field.onChange}
            error={errors.dateRange?.message}
            required
          />
        )}
      />
      <Controller
        name="eventTime"
        control={control}
        rules={{
          validate: v => {
            const sameDay =
              dateRange.startDate?.toDateString() === dateRange.endDate?.toDateString();
            if (sameDay && v.startTime >= v.endTime)
              return "Start time must be before end time";
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <EventTimeField
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
};
export default BasicInfoStep;
