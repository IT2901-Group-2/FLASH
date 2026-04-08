import { Title, TextField, Textarea, DatePicker, DateRange } from "@flash/ui";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useFormState, useWatch } from "react-hook-form";
import EventTimeField from "../TimeField";
import { CreateEvent } from "@/db";
import { formatTimeForInput } from "@/utils/date-utils";
import { EventTime } from "../defaults";

export const BasicInfoStep = () => {
  const t = useTranslations("admin.dashboard.event.basics");

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
    newStart.setHours(startH!, startM, 0, 0);
    setValue("startDate", newStart, { shouldValidate: true });

    const newEnd = new Date(endDate);
    newEnd.setHours(endH!, endM, 0, 0);
    setValue("endDate", newEnd, { shouldValidate: true });
  };

  return (
    <>
      <Title description={t("description")}>{t("title")}</Title>
      <TextField
        {...register("name", {
          required: t("field.name.error.required"),
          minLength: { value: 3, message: t("field.name.error.minLength", { min: 3 }) },
        })}
        error={errors.name?.message}
        label={t("field.name.title")}
        description={t("field.name.description")}
        aria-label={t("field.name.title")}
        required
        data-testid="name"
        autoFocus
      />
      <Textarea
        {...register("description")}
        error={errors.description?.message}
        label={t("field.description.title")}
        description={t("field.description.description")}
        aria-label={t("field.description.title")}
        data-testid="description"
        resize="vertical"
        maxRows={10}
      />
      <Controller
        name="startDate"
        control={control}
        rules={{ required: t("field.dateRange.error.required") }}
        render={({ fieldState }) => (
          <DatePicker
            label={t("field.dateRange.title")}
            description={t("field.dateRange.description")}
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
          required: t("field.dateRange.error.required"),
          validate: v => {
            if (startDate?.toDateString() === v?.toDateString())
              return startDate < v || t("field.timeRange.error.timeOrder");
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
