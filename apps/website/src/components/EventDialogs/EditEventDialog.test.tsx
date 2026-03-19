import { Event } from "@/db";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditEventDialog from "./EditEventDialog";

const mockDialog = vi.fn(({ children }: { children?: React.ReactNode }) => (
  <div data-testid="dialog">{children}</div>
));

vi.mock("@flash/ui", async importOriginal => {
  const actual = await importOriginal<typeof import("@flash/ui")>();
  return {
    ...actual,
    Dialog: (props: React.ComponentProps<typeof actual.Dialog>) => mockDialog(props),
  };
});

// --- Mocks ----------------------------------------------------------------

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/useEvents", () => ({
  useUpdateEventMutation: () => ({
    mutateAsync: mockMutateAsync,
    status: "idle",
  }),
}));

// -------------------------------------------------------------------------

const onClose = vi.fn();

const existingEvent: Event = {
  id: "event-1",
  name: "Existing Event",
  description: "Existing description",
  uploadLimit: 5,
  startDate: new Date("2026-03-01"),
  endDate: new Date("2026-03-10"),
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  isArchived: false,
};

const renderCard = () => {
  render(<EditEventDialog event={existingEvent} onClose={onClose} />);
};

const mockReportValidity = (valid: boolean) => {
  HTMLFormElement.prototype.reportValidity = vi.fn().mockReturnValue(valid);
};

beforeEach(() => {
  vi.clearAllMocks();
  mockMutateAsync.mockResolvedValue(existingEvent);
});

describe("EditEventDialog — dialog behavior", () => {
  it("disables backdrop close", () => {
    renderCard();
    expect(mockDialog).toHaveBeenCalledWith(
      expect.objectContaining({ closeOnBackdrop: false })
    );
  });
});

describe("EditEventDialog — pre-population", () => {
  it("pre-populates the name field with the existing event name", () => {
    renderCard();
    expect(screen.getByLabelText("eventName")).toHaveValue("Existing Event");
  });

  it("pre-populates the description field", () => {
    renderCard();
    expect(screen.getByLabelText("eventDescription")).toHaveValue("Existing description");
  });

  it("pre-populates the upload limit on the options step", async () => {
    mockReportValidity(true);
    renderCard();

    await userEvent.click(screen.getByText("next"));

    expect(screen.getByLabelText("maxImages")).toHaveValue(5);
  });
});

describe("EditEventDialog — navigation", () => {
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

describe("EditEventDialog — saving", () => {
  it("calls onClose after saving", async () => {
    mockReportValidity(true);
    renderCard();
    await userEvent.click(screen.getByText("next"));
    await userEvent.click(screen.getByText("save"));
    await vi.waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("saves the updated upload limit", async () => {
    mockReportValidity(true);
    renderCard();

    await userEvent.click(screen.getByText("next"));
    fireEvent.change(screen.getByLabelText("maxImages"), {
      target: { value: "12" },
    });
    await userEvent.click(screen.getByText("save"));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith({
        eventId: "event-1",
        data: expect.objectContaining({ uploadLimit: 12 }),
      })
    );
  });

  it("does not call mutateAsync when validation fails on the last step", async () => {
    mockReportValidity(false);
    renderCard();
    // Manually bump to the last step by mocking valid on first click then invalid
    HTMLFormElement.prototype.reportValidity = vi
      .fn()
      .mockReturnValueOnce(true) // passes on Next
      .mockReturnValue(false); // fails on Save
    await userEvent.click(screen.getByText("next"));
    await userEvent.click(screen.getByText("save"));
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });
});
