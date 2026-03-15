import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { Controller, useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { DatePicker } from "./DatePicker";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker/DatePicker.types";
import { DropdownControl } from "./DropdownControl";

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
        eventTime: { startTime: "00:00", endTime: "23:59" },
      },
    });

    return (
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "30rem",
        }}
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
            valueAsNumber: true, // important — parses string → number
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
            <DropdownControl
              label="Event Time"
              error={fieldState.error?.message}
              dropdownBorder
              defaultValue="full"
              onChange={selected => {
                if (selected === "full")
                  field.onChange({ startTime: "00:00", endTime: "23:59" });
                else field.onChange({ startTime: "08:00", endTime: "17:00" });
              }}
            >
              <DropdownControl.Item value="full" label="Full Day" />
              <DropdownControl.Item
                value="specific"
                label="Specific Time"
                content={
                  <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    {(["startTime", "endTime"] as const).map(key => (
                      <TextField
                        style={{ width: "5rem" }}
                        key={key}
                        type="time"
                        size="small"
                        label={key === "startTime" ? "Start Time" : "End Time"}
                        value={field.value[key]}
                        onChange={e =>
                          field.onChange({ ...field.value, [key]: e.target.value })
                        }
                      />
                    ))}
                  </div>
                }
              />
            </DropdownControl>
          )}
        />
        <div style={{ display: "flex", gap: ".5rem" }}>
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", { name: /submit/i });
    const resetButton = canvas.getByRole("button", { name: /reset/i });
    const nameInput = canvas.getByLabelText(/name/i);
    const descriptionInput = canvas.getByLabelText(/description/i);
    const uploadLimitInput = canvas.getByLabelText(/upload limit/i);

    await step("Shows validation errors on empty submit", async () => {
      await userEvent.click(submitButton);

      expect(await canvas.findByText("Name is required")).toBeInTheDocument();
      expect(await canvas.findByText("A upload limit is required")).toBeInTheDocument(); // uploadLimit
    });

    await step("Shows minLength error for Name", async () => {
      await userEvent.type(nameInput, "ab");
      await userEvent.click(submitButton);

      expect(
        await canvas.findByText("Must be at least 3 characters")
      ).toBeInTheDocument();
    });

    await step("Shows min error for Upload Limit", async () => {
      await userEvent.type(uploadLimitInput, "0");
      await userEvent.click(submitButton);

      expect(
        await canvas.findByText("The minimum allowed number of photos is 1")
      ).toBeInTheDocument();
    });

    await step("Clears errors on reset", async () => {
      await userEvent.click(resetButton);

      expect(canvas.queryByText("Name is required")).not.toBeInTheDocument();
      expect(canvas.queryByText("Description is required")).not.toBeInTheDocument();
      expect(canvas.queryByText("Must be at least 3 characters")).not.toBeInTheDocument();
    });

    await step("Submits successfully with valid data", async () => {
      await userEvent.type(nameInput, "John Doe");
      await userEvent.type(descriptionInput, "This is a valid description");
      await userEvent.clear(uploadLimitInput);
      await userEvent.type(uploadLimitInput, "5");
      await userEvent.click(submitButton);

      // No errors should be visible
      expect(canvas.queryByText("Name is required")).not.toBeInTheDocument();
      expect(canvas.queryByText("Description is required")).not.toBeInTheDocument();
      expect(
        canvas.queryByText("The minimum allowed number of photos is 1")
      ).not.toBeInTheDocument();
    });
  },
};
