import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button";
import { Textarea } from "./Textarea";
import { useForm } from "react-hook-form";

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
    const {
      register,
      reset,
      handleSubmit,
      formState: { errors },
    } = useForm();
    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={handleSubmit(data => console.log(data))}
        onReset={reset}
      >
        <TextField
          label="Name"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "Must be at least 3 characters" },
          })}
          error={errors.name?.message?.toString()}
        />
        <Textarea
          label="Description"
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "Must be at least 10 characters" },
          })}
          error={errors.description?.message?.toString()}
        />
        <TextField
          label="Upload Limit"
          type="number"
          {...register("uploadLimit", {
            required: "Name is required",
            min: { value: 1, message: "The minimum allowed number of photos is 1" },
          })}
          error={errors.uploadLimit?.message?.toString()}
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
};
