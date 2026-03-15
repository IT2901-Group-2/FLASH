import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import { DatePicker } from "./DatePicker";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker/DatePicker.types";
import { DropdownControl } from "../DropdownControl";
import { useRef } from "react";

type FormValues = {
  name: string;
  description: string;
  uploadLimit: number;
  date: DateRange;
  startTime: string;
  endTime: string;
};

const meta: Meta<typeof HTMLFormElement> = {
  title: "Patterns and Templates/Form",
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof HTMLFormElement>;

export default meta;
type Story = StoryObj<typeof HTMLFormElement>;

export const Demo: Story = {
  render: () => {
    const timeType = useRef<string>("full");

    const methods = useForm<FormValues>({
      defaultValues: {
        startTime: "00:00",
        endTime: "23:59",
      },
    });

    const {
      register,
      handleSubmit,
      control,
      setValue,
      formState: { errors },
    } = methods;

    const validateTime = (v: string) =>
      timeType.current === "specific" && !v ? "Required" : true;

    return (
      <FormProvider {...methods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "30rem",
          }}
          onSubmit={handleSubmit(data => console.log(data))}
        >
          <TextField
            label="Name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Must be at least 3 characters" },
            })}
            error={errors.name?.message}
            required
          />
          <Textarea
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
          <TextField
            label="Upload Limit"
            type="number"
            {...register("uploadLimit", {
              required: "An upload limit is required",
              min: { value: 1, message: "The minimum allowed number of photos is 1" },
            })}
            error={errors.uploadLimit?.message}
            required
          />
          <Controller
            name="date"
            control={control}
            defaultValue={DEFAULT_DATE_RANGE}
            rules={{ required: "Date is required" }}
            render={({ field, fieldState }) => (
              <DatePicker
                data-color="accent"
                label="Event Date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <DropdownControl
            label="Event Time"
            dropdownBorder
            defaultValue="full"
            onChange={val => {
              timeType.current = val;
              if (val === "full") {
                setValue("startTime", "00:00");
                setValue("endTime", "23:59");
              }
            }}
          >
            <DropdownControl.Item value="full" label="Full Day" />
            <DropdownControl.Item
              value="specific"
              label="Specific Time"
              content={
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <TextField
                    style={{ width: "7.5rem" }}
                    type="time"
                    size="small"
                    label="Start Time"
                    {...register("startTime", { validate: validateTime })}
                  />
                  <TextField
                    style={{ width: "7.5rem" }}
                    type="time"
                    size="small"
                    label="End Time"
                    {...register("endTime", { validate: validateTime })}
                  />
                </div>
              }
            />
          </DropdownControl>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <Button type="reset" variant="secondary" fill>
              Reset
            </Button>
            <Button type="submit" fill>
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
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
