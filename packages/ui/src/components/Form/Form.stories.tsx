import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect, userEvent, waitFor } from "storybook/test";
import { combineDateAndTime, FormValues, TIME_PRESETS } from "./.example/helpers";
import FormExample from "./.example/Form.example";

const meta: Meta = {
  title: "Patterns and Templates/Form",
  tags: ["autodocs"],
  parameters: {
    docs: { source: { type: "code" } },
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
        dateRange: { startDate: null, endDate: null },
        eventTime: TIME_PRESETS.full,
        sortOrder: "",
      },
    });

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "25rem" }}
        onSubmit={handleSubmit(
          ({ name, description, numberOfPhotos, dateRange, eventTime, sortOrder }) =>
            console.log({
              name,
              description,
              uploadLimit: numberOfPhotos,
              startTime: combineDateAndTime(dateRange.startDate!, eventTime.startTime),
              endTime: combineDateAndTime(dateRange.endDate!, eventTime.endTime),
              sortOrder,
            })
        )}
        onReset={() => reset()}
      >
        <FormExample control={control} errors={errors} register={register} />
      </form>
    );
  },
};

export const Tests: Story = {
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
        <FormExample control={control} errors={errors} register={register} />
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
        expect(canvas.getByText("Required")).toBeVisible();
      });
    });

    await step("Typing in Name clears its error", async () => {
      await userEvent.type(field("Name"), "ABC");
      await userEvent.click(btn("Submit"));
      await waitFor(() => {
        expect(canvas.queryByText("Name is required")).toBeNull();
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

    await step("Date range validation (not testable in jsdom)", async () => {});

    await step("End time before start time shows time error", async () => {
      await userEvent.click(canvas.getByText(/specific time/i));

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

    await step("Valid form submits without errors", async () => {
      await userEvent.clear(canvas.getByLabelText(/end time/i));
      await userEvent.type(canvas.getByLabelText(/end time/i), "20:00");

      await userEvent.click(btn("Submit"));
      await waitFor(() => {
        expect(canvas.queryByText("Name is required")).toBeNull();
        expect(canvas.queryByText("Must be 1 or more")).toBeNull();
        expect(canvas.queryByText("Both dates are required")).toBeNull();
        expect(canvas.queryByText("Start time must be before end time")).toBeNull();
      });
    });

    await step("Reset clears all fields and errors", async () => {
      await userEvent.click(btn("Reset"));
      await waitFor(() => {
        expect(field("Name")).toHaveValue("");
        expect(field("Number of photos")).toHaveValue(null);
        expect(canvas.queryByText("Name is required")).toBeNull();
      });
    });
  },
};
