import {
  defaultUpdateEventMutationReturn,
  eventHooksMock,
  makeEvent,
} from "@test-config";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUpdateEventMutation } from "@/hooks/useEvents";
import userEvent from "@testing-library/user-event";
import EditEventDialog from "./EditEventDialog";

vi.mock("@/hooks/useEvents", () => eventHooksMock());

vi.mock("./formSteps", () => ({
  FORM_STEPS: [
    {
      fields: ["name"],
      Component: () => <div data-testid="step-1">Step 1</div>,
    },
    {
      fields: ["description"],
      Component: () => <div data-testid="step-2">Step 2</div>,
    },
  ],
}));

vi.mock("./Steps", () => ({
  ReviewStep: ({ status }: { status: string }) => (
    <div data-testid="review-step" data-status={status} />
  ),
}));

function setupMutation() {
  vi.mocked(useUpdateEventMutation).mockReturnValue(defaultUpdateEventMutationReturn);
}

function renderDialog(onClose = vi.fn()) {
  return {
    onClose,
    ...render(<EditEventDialog onClose={onClose} event={makeEvent()} />),
  };
}

describe("UpdateEventDialog", () => {
  beforeEach(() => {
    setupMutation();
  });

  describe("initial render", () => {
    it("starts on step 1", () => {
      renderDialog();
      expect(screen.getByTestId("step-1")).toBeInTheDocument();
      expect(screen.queryByTestId("step-2")).not.toBeInTheDocument();
    });

    it("renders a Cancel button on the first step", () => {
      renderDialog();
      expect(screen.getByText("cancel")).toBeInTheDocument();
    });

    it("does NOT render a Previous button on the first step", () => {
      renderDialog();
      expect(screen.queryByText("previous")).not.toBeInTheDocument();
    });

    it("renders a Next button on the first step", () => {
      renderDialog();
      expect(screen.getByText("next")).toBeInTheDocument();
    });

    it("does NOT render a Create button on the first step", () => {
      renderDialog();
      expect(screen.queryByText("create")).not.toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("advances to step 2 when Next is clicked and validation passes", async () => {
      renderDialog();

      await userEvent.click(screen.getByText("next"));
      await waitFor(() => {
        expect(screen.getByTestId("step-2")).toBeInTheDocument();
      });
    });

    it("shows Previous and Create on the last step", async () => {
      renderDialog();

      await userEvent.click(screen.getByText("next"));
      await waitFor(() => {
        expect(screen.getByText("previous")).toBeInTheDocument();
        expect(screen.getByText("save")).toBeInTheDocument();
      });
    });

    it("goes back to step 1 when Previous is clicked", async () => {
      renderDialog();

      await userEvent.click(screen.getByText("next"));
      await waitFor(() => screen.getByText("previous"));

      await userEvent.click(screen.getByText("previous"));
      await waitFor(() => {
        expect(screen.getByTestId("step-1")).toBeInTheDocument();
      });
    });
  });

  describe("handleClose", () => {
    it("calls onClose when Cancel is clicked", async () => {
      const { onClose } = renderDialog();
      await userEvent.click(screen.getByText("cancel"));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("resets back to step 1 after close", async () => {
      renderDialog();

      await userEvent.click(screen.getByText("next"));
      await waitFor(() => screen.getByTestId("step-2"));

      await userEvent.click(screen.getByText("cancel"));
      await waitFor(() => {
        expect(screen.queryByTestId("step-2")).not.toBeInTheDocument();
      });
    });
  });

  describe("ProgressDots", () => {
    it("passes the correct maxValue (steps + review)", () => {
      renderDialog();
      const dots = screen.getByTestId("progress-dots");
      expect(dots).toHaveAttribute("data-max-value", "2");
    });

    it("starts at step 1 (value = 1)", () => {
      renderDialog();
      const dots = screen.getByTestId("progress-dots");
      expect(dots).toHaveAttribute("data-value", "1");
    });

    it("advances the dot value when navigating forward", async () => {
      renderDialog();

      await userEvent.click(screen.getByText("next"));
      await waitFor(() => {
        const dots = screen.getByTestId("progress-dots");
        expect(dots).toHaveAttribute("data-value", "2");
      });
    });
  });
});
