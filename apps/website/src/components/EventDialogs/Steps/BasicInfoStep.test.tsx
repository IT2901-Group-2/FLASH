import { screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BasicInfoStep } from "./BasicInfoStep";
import { renderWithForm, TEST_DEFAULT_FORM_DATA } from "@test-config";
import type { UseFormReturn } from "react-hook-form";
import type { CreateEvent } from "@/db";
import userEvent from "@testing-library/user-event";

vi.mock("../TimeField", () => ({
  default: () => <div data-testid="time-field" />,
}));

/** Captures form methods so individual tests can call setValue / trigger. */
let capturedMethods: UseFormReturn<CreateEvent>;

function renderStep(defaultValues = TEST_DEFAULT_FORM_DATA) {
  return renderWithForm(<BasicInfoStep />, {
    defaultValues,
    onMethods: m => {
      capturedMethods = m as UseFormReturn<CreateEvent>;
    },
  });
}

describe("BasicInfoStep", () => {
  describe("rendering", () => {
    it("renders title and description", () => {
      renderStep();
      expect(screen.getByTestId("title")).toBeInTheDocument();
    });

    it("renders the name field", () => {
      renderStep();
      expect(screen.getByTestId("name")).toBeInTheDocument();
    });

    it("renders the description textarea", () => {
      renderStep();
      expect(screen.getByTestId("description")).toBeInTheDocument();
    });
  });

  describe("name field validation", () => {
    it("shows required error when name is empty and field is touched", async () => {
      renderStep();
      const nameInput = screen.getByTestId("name");

      await userEvent.clear(nameInput);

      await act(async () => {
        await capturedMethods.trigger("name");
      });

      await waitFor(() => {
        expect(screen.getByText("field.name.error.required")).toBeInTheDocument();
      });
    });

    it("shows minLength error when name is too short", async () => {
      renderStep();
      const nameInput = screen.getByTestId("name");

      await userEvent.type(nameInput, "ab");

      await act(async () => {
        await capturedMethods.trigger("name");
      });

      await waitFor(() => {
        expect(screen.getByText("field.name.error.minLength")).toBeInTheDocument();
      });
    });

    it("clears validation error when a valid name is entered", async () => {
      renderStep();
      const nameInput = screen.getByTestId("name");

      // Trigger error first
      await userEvent.clear(nameInput);
      await act(async () => {
        await capturedMethods.trigger("name");
      });

      await userEvent.type(nameInput, "My Great Event");
      await act(async () => {
        await capturedMethods.trigger("name");
      });

      await waitFor(() => {
        expect(screen.queryByText("field.name.error.required")).not.toBeInTheDocument();
      });
    });
  });
});
