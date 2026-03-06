import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateEventDialog from "./CreateEventDialog";
import { Event } from "@/db";

// --- Mocks ----------------------------------------------------------------

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/useEvents", () => ({
  useCreateEventMutation: () => ({
    mutateAsync: mockMutateAsync,
    status: "idle",
  }),
}));

const onClose = vi.fn();

const renderCard = () => {
  render(<CreateEventDialog onClose={onClose} />);
};

/**
 * Simulates the form's reportValidity returning the given value.
 * This is necessary because jsdom does not implement browser-native
 * constraint validation for custom UI library components.
 */
const mockReportValidity = (valid: boolean) => {
  HTMLFormElement.prototype.reportValidity = vi.fn().mockReturnValue(valid);
};

beforeEach(() => {
  vi.clearAllMocks();
  mockMutateAsync.mockResolvedValue({} as Event);
});

describe("CreateEventDialog — navigation", () => {
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
describe("CreateEventDialog — submission", () => {
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

describe("CreateEventDialog — cancel", () => {
  it("calls onClose when clicking cancel", async () => {
    renderCard();
    await userEvent.click(screen.getByText("cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
