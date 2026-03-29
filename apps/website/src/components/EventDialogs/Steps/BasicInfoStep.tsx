import { Title, TextField, Textarea, DatePicker, DateRange } from "@flash/ui";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useFormState, useWatch } from "react-hook-form";
import EventTimeField from "../TimeField";
import { CreateEvent } from "@/db";
import { formatTimeForInput } from "@/utils/date-utils";
import { EventTime } from "../types";

export const BasicInfoStep = () => {
  const tStep = useTranslations("admin.dashboard.event.create.basics");
  const tFields = useTranslations("common.fields");

  const { register, control, setValue } = useFormContext<CreateEvent>();
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });
  const { errors } = useFormState({ control });

  const handleDateRangeChange = (range: DateRange) => {
    if (range.startDate) {
      const d = new Date(range.startDate);
      d.setHours(startDate?.getHours() ?? 0, startDate?.getMinutes() ?? 0);
      setValue("startDate", d, { shouldValidate: true });
    }
    if (range.endDate) {
      const d = new Date(range.endDate);
      d.setHours(endDate?.getHours() ?? 23, endDate?.getMinutes() ?? 59);
      setValue("endDate", d, { shouldValidate: true });
    }
  };

  const handleTimeChange = (time: EventTime) => {
    const [startH, startM] = time.startTime.split(":").map(Number);
    const [endH, endM] = time.endTime.split(":").map(Number);

    const newStart = new Date(startDate);
    newStart.setHours(startH, startM, 0, 0);
    setValue("startDate", newStart, { shouldValidate: true });

    const newEnd = new Date(endDate);
    newEnd.setHours(endH, endM, 0, 0);
    setValue("endDate", newEnd, { shouldValidate: true });
  };

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
        name="startDate"
        control={control}
        rules={{ required: "Both dates are required" }}
        render={({ fieldState }) => (
          <DatePicker
            label="Date range"
            data-color="accent"
            value={{ startDate, endDate }}
            onChange={handleDateRangeChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />
      <Controller
        name="endDate"
        control={control}
        rules={{
          required: "Both dates are required",
          validate: v => {
            if (startDate?.toDateString() === v?.toDateString()) {
              return startDate < v || "Start time must be before end time";
            }
            return true;
          },
        }}
        render={({ fieldState }) => (
          <EventTimeField
            value={{
              startTime: formatTimeForInput(startDate),
              endTime: formatTimeForInput(endDate),
            }}
            onChange={handleTimeChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
};
export default BasicInfoStep;
