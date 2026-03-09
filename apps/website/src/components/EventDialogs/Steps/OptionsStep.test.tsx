import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OptionsStep } from "./OptionsStep";
import { CreateEvent } from "@/db";

const baseFormData: CreateEvent = {
  name: "Test",
  description: "Test",
  uploadLimit: 10,
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-01-02"),
};

const renderStep = (overrides: Partial<CreateEvent> = {}) => {
  const updateFormData = vi.fn();
  render(
    <OptionsStep
      formData={{ ...baseFormData, ...overrides }}
      updateFormData={updateFormData}
    />
  );
  return { updateFormData };
};

describe("OptionsStep", () => {
  it("shows the upload limit input when mode is limited", () => {
    renderStep({ uploadLimit: 10 });
    expect(screen.getByLabelText("maxImages")).toBeInTheDocument();
  });

  it("clears the upload limit when switching to unlimited", async () => {
    const { updateFormData } = renderStep({ uploadLimit: 10 });
    await userEvent.click(screen.getByText(/unlimited/i));
    expect(updateFormData).toHaveBeenCalledWith("uploadLimit", undefined);
  });

  it("enforces a minimum of 1 on the upload limit input", () => {
    renderStep({ uploadLimit: 5 });
    expect(screen.getByLabelText("maxImages")).toHaveAttribute("min", "1");
  });
});
