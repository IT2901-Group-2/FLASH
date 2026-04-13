import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EventTimeField from "./TimeField";
import { TIME_PRESETS } from "./defaults";
import userEvent from "@testing-library/user-event";

const FULL_VALUE = {
  startTime: TIME_PRESETS.full.startTime,
  endTime: TIME_PRESETS.full.endTime,
};

const SPECIFIC_VALUE = { startTime: "09:30", endTime: "17:00" };

function renderField({
  value = FULL_VALUE,
  onChange = vi.fn(),
  error,
}: {
  value?: typeof FULL_VALUE;
  onChange?: (v: typeof FULL_VALUE) => void;
  error?: string;
} = {}) {
  return {
    onChange,
    ...render(<EventTimeField value={value} onChange={onChange} error={error} />),
  };
}

describe("EventTimeField", () => {
  describe("rendering", () => {
    it("renders the dropdown label", () => {
      renderField();
      expect(screen.getByText("title")).toBeInTheDocument();
    });

    it("renders both preset items", () => {
      renderField();
      expect(screen.getByText("value.full")).toBeInTheDocument();
      expect(screen.getByText("value.specific")).toBeInTheDocument();
    });

    it("forwards an error prop to the DropdownControl", () => {
      renderField({ error: "Time order is invalid" });
      expect(screen.getByText("Time order is invalid")).toBeInTheDocument();
    });
  });

  describe("preset detection", () => {
    it("selects 'full' when value matches the full-day preset", () => {
      renderField({ value: FULL_VALUE });
      const dropdown = screen.getByTestId("dropdown-control");
      expect(dropdown).toHaveAttribute("data-value", "full");
    });

    it("selects 'specific' when value does not match full-day preset", () => {
      renderField({ value: SPECIFIC_VALUE });
      const dropdown = screen.getByTestId("dropdown-control");
      expect(dropdown).toHaveAttribute("data-value", "specific");
    });
  });

  describe("preset change", () => {
    it("calls onChange with the full preset times when 'full' is selected", async () => {
      const { onChange } = renderField({ value: SPECIFIC_VALUE });

      await userEvent.click(screen.getByText("value.full"));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(TIME_PRESETS.full);
    });

    it("calls onChange with the specific preset times when 'specific' is selected", async () => {
      const { onChange } = renderField({ value: FULL_VALUE });

      await userEvent.click(screen.getByText("value.specific"));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(TIME_PRESETS.specific);
    });
  });

  describe("time inputs (specific mode)", () => {
    it("calls onChange with updated startTime when start input changes", () => {
      const { onChange } = renderField({ value: SPECIFIC_VALUE });

      const startInput = screen.getByLabelText("value.startTime");
      fireEvent.change(startInput, { target: { value: "11:00" } });

      expect(onChange).toHaveBeenCalledWith({
        ...SPECIFIC_VALUE,
        startTime: "11:00",
      });
    });

    it("calls onChange with updated endTime when end input changes", () => {
      const { onChange } = renderField({ value: SPECIFIC_VALUE });

      const endInput = screen.getByLabelText("value.endTime");
      fireEvent.change(endInput, { target: { value: "20:30" } });

      expect(onChange).toHaveBeenCalledWith({
        ...SPECIFIC_VALUE,
        endTime: "20:30",
      });
    });
  });
});
