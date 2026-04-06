import { eventHooksMock, makeEvent } from "@test-config";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditEventDialog from "./EditEventDialog";
import { Dialog } from "@flash/ui";

const MockedDialog = vi.mocked(Dialog);

vi.mock("@/hooks/useEvents", () => eventHooksMock());

const onClose = vi.fn();
const renderCard = () => {
  render(
    <EditEventDialog
      event={makeEvent({
        name: "Existing Event",
        description: "Existing description",
        uploadLimit: 5,
      })}
      onClose={onClose}
    />
  );
};

const mockReportValidity = (valid: boolean) => {
  HTMLFormElement.prototype.reportValidity = vi.fn().mockReturnValue(valid);
};

describe("EditEventDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Dialog behavior", () => {
    it("disables backdrop close", () => {
      renderCard();
      expect(MockedDialog.mock.calls[0]![0]).toMatchObject({ closedby: "none" });
    });
  });

  describe("Pre-population", () => {
    it("pre-populates the name field with the existing event name", () => {
      renderCard();
      expect(screen.getByLabelText("eventName")).toHaveValue("Existing Event");
    });

    it("pre-populates the description field", () => {
      renderCard();
      expect(screen.getByLabelText("eventDescription")).toHaveValue(
        "Existing description"
      );
    });

    it("pre-populates the upload limit on the options step", async () => {
      mockReportValidity(true);
      renderCard();

      await userEvent.click(screen.getByText("next"));

      expect(screen.getByLabelText("maxImages")).toHaveValue(5);
    });
  });

  describe("Navigation", () => {
    it("renders the first step on mount", () => {
      renderCard();
      expect(screen.getByLabelText("eventName")).toBeInTheDocument();
    });

    it("does not advance when validation fails", async () => {
      mockReportValidity(false);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      expect(screen.getByLabelText("eventName")).toBeInTheDocument();
    });

    it("advances to step 2 when validation passes", async () => {
      mockReportValidity(true);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      expect(screen.getByLabelText("maxImages")).toBeInTheDocument();
    });

    it("does not show ReviewStep at any point", async () => {
      mockReportValidity(true);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      // After the last step, save is called — there is no review
      expect(screen.queryByText("finish")).not.toBeInTheDocument();
    });
  });

  describe("Saving", async () => {
    it("calls onClose after saving", async ({ skip }) => {
      mockReportValidity(true);
      renderCard();

      // TODO - Update this when inputs are redone
      skip();
    });

    it("saves the updated upload limit", async ({ skip }) => {
      mockReportValidity(true);
      renderCard();

      // TODO - Update this when inputs are redone
      skip();
    });

    it("does not call mutateAsync when validation fails on the last step", async ({
      skip,
    }) => {
      mockReportValidity(false);
      renderCard();

      // TODO - Update this when inputs are redone
      skip();
    });
  });
});
