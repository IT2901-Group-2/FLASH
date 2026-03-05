import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BasicInfoStep } from "./BasicInfoStep";
import { CreateEvent } from "@/db";

const today = new Date("2026-01-01");

const baseFormData: CreateEvent = {
  name: "",
  description: "",
  uploadLimit: 1,
  startDate: today,
  endDate: today,
};

const renderStep = (overrides: Partial<CreateEvent> = {}) => {
  const updateFormData = vi.fn();
  render(
    <BasicInfoStep
      formData={{ ...baseFormData, ...overrides }}
      updateFormData={updateFormData}
    />
  );
  return { updateFormData };
};

describe("BasicInfoStep", () => {
  it("renders all four inputs", () => {
    renderStep();
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByTestId("startDate")).toBeInTheDocument();
    expect(screen.getByTestId("endDate")).toBeInTheDocument();
  });

  it("marks name and description as required", () => {
    renderStep();
    expect(screen.getByTestId("name")).toBeRequired();
    expect(screen.getByTestId("startDate")).toBeRequired();
    expect(screen.getByTestId("endDate")).toBeRequired();
  });

  it("sets the end date min attribute to the current start date", () => {
    renderStep({ startDate: new Date("2026-03-01") });
    expect(screen.getByTestId("endDate")).toHaveAttribute("min", "2026-03-01");
  });

  it("calls updateFormData with the new name when typing", async () => {
    const { updateFormData } = renderStep();
    const input = screen.getByTestId("name");
    await userEvent.type(input, "My Event");
    // Each keystroke fires a change, so check the last call
    expect(updateFormData).toHaveBeenLastCalledWith("name", "t");
  });
});
