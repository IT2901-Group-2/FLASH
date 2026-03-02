import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeratePage from "./page";
import * as useImagesModule from "@/hooks/useImages";

const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ id: "event-1", locale: "en" })),
  useRouter: vi.fn(() => ({ back: mockBack })),
}));

const mockUpdateImage = vi.fn(() => Promise.resolve({}));

vi.mock("@/hooks/useImages", () => ({
  useImagesQuery: vi.fn(() => ({
    data: [
      { id: "img-1", eventId: "event-1", isApproved: null },
      { id: "img-2", eventId: "event-1", isApproved: null },
      { id: "img-3", eventId: "event-1", isApproved: null },
    ],
    isLoading: false,
  })),
  useUpdateImageMutation: vi.fn(() => ({
    mutateAsync: mockUpdateImage,
  })),
}));

// Mock UI components to simplify testing
vi.mock("ui", () => ({
  ModerateHeader: ({
    onBack,
    selectMode,
    onSelectToggle,
    onSelectAll,
  }: {
    onBack: () => void;
    selectMode: boolean;
    onSelectToggle: () => void;
    onSelectAll: () => void;
  }) => (
    <header>
      <button aria-label="Go back" onClick={onBack}>
        Back
      </button>
      <h1>Moderate</h1>
      <div>
        {selectMode && <button onClick={onSelectAll}>Select All</button>}
        <button onClick={onSelectToggle}>{selectMode ? "Cancel" : "Select"}</button>
      </div>
    </header>
  ),
  SegmentedControl: Object.assign(
    ({
      children,
      value,
      onChange,
    }: {
      children: React.ReactNode;
      value: string;
      onChange: (v: string) => void;
      fill?: boolean;
      "data-color"?: string;
    }) => (
      <div data-testid="segmented-control" data-value={value}>
        {/* Pass onChange to children via context-like pattern */}
        {Array.isArray(children)
          ? children.map(
              (child: React.ReactElement<{ _onChange?: (v: string) => void }>) =>
                child ? React.cloneElement(child, { _onChange: onChange }) : child
            )
          : children}
      </div>
    ),
    {
      Item: ({
        value,
        label,
        disabled,
        _onChange,
      }: {
        value: string;
        label: string;
        disabled?: boolean;
        _onChange?: (v: string) => void;
      }) => (
        <button
          data-testid={`tab-${value}`}
          disabled={disabled}
          onClick={() => _onChange?.(value)}
        >
          {label}
        </button>
      ),
    }
  ),
  ImageCard: ({
    title,
    state,
    onClick,
    ...rest
  }: {
    title: string;
    state: string;
    onClick: () => void;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`image-card-${title}`}
      data-state={state}
      data-image-id={rest["data-image-id"]}
      onClick={onClick}
    >
      {title}
    </div>
  ),
  ActionCard: ({
    description,
    primaryButton,
    secondaryButton,
  }: {
    description?: string;
    primaryButton?: { text: string; onClick: () => void };
    secondaryButton?: { text: string; onClick: () => void };
  }) => (
    <div data-testid="action-card">
      {description && <span data-testid="action-card-description">{description}</span>}
      {primaryButton && (
        <button data-testid="primary-action" onClick={primaryButton.onClick}>
          {primaryButton.text}
        </button>
      )}
      {secondaryButton && (
        <button data-testid="secondary-action" onClick={secondaryButton.onClick}>
          {secondaryButton.text}
        </button>
      )}
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ModeratePage", () => {
  it("renders three segmented control tabs; defaults to Pending", () => {
    render(<ModeratePage />);

    expect(screen.getByTestId("tab-pending")).toBeDefined();
    expect(screen.getByTestId("tab-approved")).toBeDefined();
    expect(screen.getByTestId("tab-rejected")).toBeDefined();

    const control = screen.getByTestId("segmented-control");
    expect(control.getAttribute("data-value")).toBe("pending");
  });

  it("switching tabs updates the displayed images to match the selected status", () => {
    render(<ModeratePage />);

    // Verify useImagesQuery is called with pending initially
    expect(useImagesModule.useImagesQuery).toHaveBeenCalledWith("event-1", {
      approval: "pending",
    });

    // Click approved tab
    fireEvent.click(screen.getByTestId("tab-approved"));

    // Verify useImagesQuery is called with approved
    expect(useImagesModule.useImagesQuery).toHaveBeenCalledWith("event-1", {
      approval: "approved",
    });
  });

  it('clicking "Select" enters select mode: button label changes to "Cancel", tabs become disabled', () => {
    render(<ModeratePage />);

    const selectButton = screen.getByText("Select");
    fireEvent.click(selectButton);

    // Button should now say "Cancel"
    expect(screen.getByText("Cancel")).toBeDefined();

    // Tabs should be disabled
    expect((screen.getByTestId("tab-pending") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId("tab-approved") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId("tab-rejected") as HTMLButtonElement).disabled).toBe(true);
  });

  it('clicking "Cancel" (header) exits select mode: button reverts to "Select", tabs re-enabled, selection cleared', () => {
    render(<ModeratePage />);

    // Enter select mode
    fireEvent.click(screen.getByText("Select"));

    // Select an image
    fireEvent.click(screen.getByTestId("image-card-img-1"));

    // Click Cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Button should revert to "Select"
    expect(screen.getByText("Select")).toBeDefined();

    // Tabs should be re-enabled
    expect((screen.getByTestId("tab-pending") as HTMLButtonElement).disabled).toBe(false);

    // All images should be in default state
    expect(screen.getByTestId("image-card-img-1").getAttribute("data-state")).toBe(
      "default"
    );
  });

  it("tapping an image in select mode toggles its selected state", () => {
    render(<ModeratePage />);

    // Enter select mode
    fireEvent.click(screen.getByText("Select"));

    const imageCard = screen.getByTestId("image-card-img-1");

    // Tap to select
    fireEvent.click(imageCard);
    expect(imageCard.getAttribute("data-state")).toBe("selected");

    // Tap again to deselect
    fireEvent.click(imageCard);
    expect(imageCard.getAttribute("data-state")).toBe("default");
  });

  it("ActionCard is hidden when no images are selected; visible with correct count when >=1 selected", () => {
    render(<ModeratePage />);

    // No ActionCard initially
    expect(screen.queryByTestId("action-card")).toBeNull();

    // Enter select mode and select an image
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByTestId("image-card-img-1"));

    // ActionCard should be visible
    expect(screen.getByTestId("action-card")).toBeDefined();
    expect(screen.getByTestId("action-card-description").textContent).toBe(
      "1 photo selected"
    );

    // Select another
    fireEvent.click(screen.getByTestId("image-card-img-2"));
    expect(screen.getByTestId("action-card-description").textContent).toBe(
      "2 photos selected"
    );
  });

  it('clicking "Cancel" in header while images are selected exits select mode and clears the selection', () => {
    render(<ModeratePage />);

    // Enter select mode and select images
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByTestId("image-card-img-1"));
    fireEvent.click(screen.getByTestId("image-card-img-2"));

    // ActionCard should be visible
    expect(screen.getByTestId("action-card")).toBeDefined();

    // Click Cancel in header
    fireEvent.click(screen.getByText("Cancel"));

    // ActionCard should be gone
    expect(screen.queryByTestId("action-card")).toBeNull();

    // All images should be in default state
    expect(screen.getByTestId("image-card-img-1").getAttribute("data-state")).toBe(
      "default"
    );
  });

  it("cannot switch tabs while in select mode (tab items are disabled)", () => {
    render(<ModeratePage />);

    // Enter select mode
    fireEvent.click(screen.getByText("Select"));

    // Try clicking a tab — it should be disabled
    const approvedTab = screen.getByTestId("tab-approved") as HTMLButtonElement;
    expect(approvedTab.disabled).toBe(true);

    // Click the disabled tab
    fireEvent.click(approvedTab);

    // Should still be on pending tab
    const control = screen.getByTestId("segmented-control");
    expect(control.getAttribute("data-value")).toBe("pending");
  });

  it("empty state renders when the active tab has zero images", () => {
    vi.mocked(useImagesModule.useImagesQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useImagesModule.useImagesQuery>);

    render(<ModeratePage />);

    expect(screen.getByText("No pending photos found")).toBeDefined();
  });
});
