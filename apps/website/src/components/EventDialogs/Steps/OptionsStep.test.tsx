import { screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OptionsStep } from "./OptionsStep";
import { renderWithForm, TEST_DEFAULT_FORM_DATA } from "@test-config";
import type { UseFormReturn } from "react-hook-form";
import type { CreateEvent } from "@/db";
import userEvent from "@testing-library/user-event";

let capturedMethods: UseFormReturn<CreateEvent>;

function renderStep(uploadLimit: number | null = null) {
  return renderWithForm(<OptionsStep />, {
    defaultValues: { ...TEST_DEFAULT_FORM_DATA, uploadLimit },
    onMethods: m => {
      capturedMethods = m as UseFormReturn<CreateEvent>;
    },
  });
}

describe("OptionsStep", () => {
  describe("rendering", () => {
    it("renders title and description", () => {
      renderStep();
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("renders the upload-limit dropdown", () => {
      renderStep();
      expect(screen.getByText("fields.uploadLimit.title")).toBeInTheDocument();
    });

    it("renders the auto-approve switch", () => {
      renderStep();
      expect(screen.getByText("fields.autoApprovePhotos.title")).toBeInTheDocument();
    });

    it("renders the guest-can-view-all switch", () => {
      renderStep();
      expect(screen.getByText("fields.guestCanViewAll.title")).toBeInTheDocument();
    });
  });

  describe("limitMode initialisation from form value", () => {
    it("starts in unlimited mode when uploadLimit is null", ({ skip }) => {
      skip();
      renderStep(null);
      const numberInput = screen.getByTestId("text-field");
      expect(numberInput).not.toBeRequired();
    });

    it("starts in limited mode when uploadLimit has a value", () => {
      renderStep(10);
      const numberInput = screen.getByRole("spinbutton");
      expect(numberInput).toBeRequired();
    });
  });

  describe("unlimited → form value sync", () => {
    it("resets uploadLimit to null on mount when in unlimited mode", async () => {
      renderStep(null);

      await waitFor(() => {
        expect(capturedMethods.getValues("uploadLimit")).toBeNull();
      });
    });
  });

  describe("validation", () => {
    it("shows required error when limitMode is limited and field is empty", async () => {
      renderStep(null);

      await userEvent.click(screen.getByText("fields.uploadLimit.value.limited"));

      await act(async () => await capturedMethods.trigger("uploadLimit"));
      await waitFor(() => {
        expect(screen.getByText("fields.uploadLimit.error.required")).toBeInTheDocument();
      });
    });

    it("shows min error when value is less than 1", async () => {
      renderStep(10);

      const numberInput = screen.getByRole("spinbutton");
      await userEvent.clear(numberInput);
      await userEvent.type(numberInput, "-5");

      await act(async () => await capturedMethods.trigger("uploadLimit"));
      await waitFor(() => {
        expect(screen.getByText("fields.uploadLimit.error.min")).toBeInTheDocument();
      });
    });

    it("does not show an error when limitMode is unlimited", async () => {
      renderStep(null);

      await act(async () => {
        await capturedMethods.trigger("uploadLimit");
      });

      expect(
        screen.queryByText("fields.uploadLimit.error.required")
      ).not.toBeInTheDocument();
    });
  });

  describe("limitMode toggle", () => {
    it("switching to unlimited sets uploadLimit back to null", async () => {
      renderStep(5);

      await userEvent.click(screen.getByText("fields.uploadLimit.value.unlimited"));

      await waitFor(() => {
        expect(capturedMethods.getValues("uploadLimit")).toBeNull();
      });
    });
  });
});
