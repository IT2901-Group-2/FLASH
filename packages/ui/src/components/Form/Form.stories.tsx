import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { Controller, useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { DatePicker } from "./DatePicker";
import { DateRange } from "./DatePicker/DatePicker.types";
import EventTimeField from "./.example/TimeField";
import { TIME_PRESETS } from "./.example/helpers";

type FormValues = {
  name: string;
  description: string;
  numberOfPhotos: number;
  dateRange: DateRange;
  eventTime: {
    startTime: string;
    endTime: string;
  };
};

const meta: Meta<typeof HTMLFormElement> = {
  title: "Patterns and Templates/Form",
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      source: {
        type: "code",
      },
    },
  },
} satisfies Meta<typeof HTMLFormElement>;

export default meta;
type Story = StoryObj<typeof HTMLFormElement>;

export const Demo: Story = {
  render: () => {
    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        numberOfPhotos: 1,
        dateRange: { startDate: null, endDate: null },
        eventTime: TIME_PRESETS.full,
      },
    });

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "25rem" }}
        onSubmit={handleSubmit(data => console.log(data))}
        onReset={() => reset()}
      >
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
            validate: v =>
              v.startTime < v.endTime || "Start time must be before end time",
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
      </form>
    );
  },
};
