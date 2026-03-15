import { Button } from "../../Button";
import { DatePicker } from "./../DatePicker";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Textarea } from "./../Textarea";
import { TextField } from "./../TextField";
import EventTimeField from "./../.example/TimeField";
import { FormValues } from "./helpers";

type Props = {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
};

const FormExample = ({ register, control, errors }: Props) => {
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
          validate: v => v.startTime < v.endTime || "Start time must be before end time",
        }}
        render={({ field, fieldState }) => (
          <EventTimeField
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
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
