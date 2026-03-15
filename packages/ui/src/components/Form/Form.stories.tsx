import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "./DatePicker";
import { DateRange } from "./DatePicker/DatePicker.types";
import EventTimeField from "./.example/TimeField";
import { TIME_PRESETS } from "./.example/helpers";
import { expect, userEvent, waitFor } from "storybook/test";

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

const meta: Meta = {
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
        numberOfPhotos: undefined,
        dateRange: { startDate: new Date(), endDate: new Date() },
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
  play: async ({ canvas, step }) => {
    const field = (label: string) => canvas.getByRole("textbox", { name: label });
    const btn = (name: string) => canvas.getByRole("button", { name });

    await step("Submit empty form shows validation errors", async () => {
      await userEvent.click(btn("Submit"));
      await waitFor(() => {
        expect(canvas.getByText("Name is required")).toBeVisible();
        expect(canvas.getByText("Required")).toBeVisible(); // numberOfPhotos
        // expect(canvas.getByText("Both dates are required")).toBeVisible();
      });
    });

    await step("Typing in Name clears its error", async () => {
      await userEvent.type(field("Name"), "ABC");
      await userEvent.click(btn("Submit"));
      await waitFor(() => {
        expect(canvas.queryByText("Name is required")).toBeNull();
        // expect(canvas.getByText("Both dates are required")).toBeVisible(); // others still showing
      });
    });

    await step("numberOfPhotos below min shows range error", async () => {
      const numField = field("Number of photos");
      await userEvent.clear(numField);
      await userEvent.type(numField, "0");
      await userEvent.click(btn("Submit"));
      await waitFor(() => expect(canvas.getByText("Must be 1 or more")).toBeVisible());
    });

    await step("Valid numberOfPhotos clears range error", async () => {
      const numField = field("Number of photos");
      await userEvent.clear(numField);
      await userEvent.type(numField, "5");
      await userEvent.click(btn("Submit"));
      await waitFor(() => expect(canvas.queryByText("Must be 1 or more")).toBeNull());
    });

    await step("Selecting a date range clears its error", async () => {
      // Popover not supported in jsdom. Cannot test this.
    });

    await step("End time before start time shows time error", async () => {
      // EventTimeField exposes two time inputs — adjust names to match your impl

      const specificTimeTab = canvas.getByText(/specific time/i);
      await userEvent.click(specificTimeTab);

      const startTime = canvas.getByLabelText(/start time/i);
      const endTime = canvas.getByLabelText(/end time/i);

      await userEvent.clear(startTime);
      await userEvent.type(startTime, "18:00");
      await userEvent.clear(endTime);
      await userEvent.type(endTime, "09:00");

      await userEvent.click(btn("Submit"));
      await waitFor(() =>
        expect(canvas.getByText("Start time must be before end time")).toBeVisible()
      );
    });

    await step("Valid form submits without any errors", async () => {
      const endTime = canvas.getByLabelText(/end time/i);
      await userEvent.clear(endTime);
      await userEvent.type(endTime, "20:00");

      await userEvent.click(btn("Submit"));
      await waitFor(() => {
        expect(canvas.queryByText("Name is required")).toBeNull();
        expect(canvas.queryByText("Must be 1 or more")).toBeNull();
        expect(canvas.queryByText("Both dates are required")).toBeNull();
        expect(canvas.queryByText("Start time must be before end time")).toBeNull();
      });
    });

    await step("Reset button clears all fields and errors", async () => {
      await userEvent.click(btn("Reset"));
      await waitFor(() => {
        expect(field("Name")).toHaveValue("");
        expect(field("Number of photos")).toHaveValue(null);
        expect(canvas.queryByText("Name is required")).toBeNull();
      });
    });
  },
};
