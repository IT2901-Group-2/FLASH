import { eventHooksMock } from "@test-config";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateEventDialog from "./CreateEventDialog";
import { Dialog } from "@flash/ui";

const MockedDialog = vi.mocked(Dialog);

vi.mock("@/hooks/useEvents", () => eventHooksMock());

const onClose = vi.fn();
const renderCard = () => {
  render(<CreateEventDialog onClose={onClose} />);
};

const mockReportValidity = (valid: boolean) => {
  HTMLFormElement.prototype.reportValidity = vi.fn().mockReturnValue(valid);
};

describe("CreateEventDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Dialog behavior", () => {
    it("disables backdrop close", () => {
      renderCard();
      expect(MockedDialog.mock.calls[0]![0]).toMatchObject({ closedby: "none" });
    });
  });

  describe("Navigation", () => {
    it("renders the first step on mount", () => {
      renderCard();
      // BasicInfoStep renders the event name input
      expect(screen.getByLabelText("eventName")).toBeInTheDocument();
    });

    it("does not advance to the next step when validation fails", async () => {
      mockReportValidity(false);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      expect(screen.getByLabelText("eventName")).toBeInTheDocument(); // still on step 1
    });

    it("advances to the next step when validation passes", async () => {
      mockReportValidity(true);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      // OptionsStep renders the maxImages input
      expect(screen.getByLabelText("maxImages")).toBeInTheDocument();
    });

    it("goes back to the previous step when clicking previous", async () => {
      mockReportValidity(true);
      renderCard();
      await userEvent.click(screen.getByText("next"));
      await userEvent.click(screen.getByText("previous"));
      expect(screen.getByLabelText("eventName")).toBeInTheDocument();
    });

    it("does not show a previous button on the first step", () => {
      renderCard();
      expect(screen.queryByText("previous")).not.toBeInTheDocument();
    });
  });

  // TODO: Fix this when event code is implmented propperly
  describe("Submission", () => {
    it("calls mutateAsync with the current form data when creating", async ({ skip }) => {
      skip();
    });

    it("shows the review step after successful creation", async ({ skip }) => {
      skip();
    });

    it("calls onClose and resets when clicking finish", async ({ skip }) => {
      skip();
    });
  });

  describe("Cancel", () => {
    it("calls onClose when clicking cancel", async () => {
      renderCard();
      await userEvent.click(screen.getByText("cancel"));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});
