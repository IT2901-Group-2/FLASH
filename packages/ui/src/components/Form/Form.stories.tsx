import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { FormProvider, useForm } from "react-hook-form";
import { expect, userEvent, within } from "storybook/test";
import DatePickerField from "./DatePicker/DatePickerField";

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
    const methods = useForm();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = methods;

    return (
      <FormProvider {...methods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          onSubmit={handleSubmit(data => console.log(data))}
        >
          <TextField
            label="Name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Must be at least 3 characters" },
            })}
            error={errors.name?.message?.toString()}
            required
          />
          <Textarea
            label="Description"
            {...register("description")}
            error={errors.description?.message?.toString()}
          />
          <TextField
            label="Upload Limit"
            type="number"
            {...register("uploadLimit", {
              required: "A upload limit is required",
              min: { value: 1, message: "The minimum allowed number of photos is 1" },
            })}
            error={errors.uploadLimit?.message?.toString()}
            required
          />
          <DatePickerField
            label="Date"
            startName="startDate"
            endName="endDate"
            data-color="accent"
            required
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
