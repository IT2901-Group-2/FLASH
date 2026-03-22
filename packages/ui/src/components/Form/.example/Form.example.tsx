import { Button } from "../../Button";
import { DatePicker } from "./../DatePicker";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { Textarea } from "./../Textarea";
import { TextField } from "./../TextField";
import EventTimeField from "./../.example/TimeField";
import { FormValues } from "./helpers";
import { Select } from "../Select";

type Props = {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
};

const FormExample = ({ register, control, errors }: Props) => {
  const dateRange = useWatch({ control, name: "dateRange" });

  return (
    <>
      <TextField
        label="Name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />
      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />
      <TextField
        label="Number of photos"
        type="number"
        error={errors.numberOfPhotos?.message}
        {...register("numberOfPhotos", {
          required: "Required",
          min: { value: 1, message: "Must be 1 or more" },
          valueAsNumber: true,
        })}
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
      <Select label="Sort by" defaultValue="name" {...register("sortOrder")}>
        <Select.Option value="name" label="Event name" />
        <Select.Option value="startDate" label="Start date" />
        <Select.Option value="endDate" label="End date" />
        <Select.Option value="createdAt" label="Created at" />
      </Select>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button type="reset" variant="secondary" fill>
          Reset
        </Button>
        <Button type="submit" fill>
          Submit
        </Button>
      </div>
    </>
  );
};
export default FormExample;
