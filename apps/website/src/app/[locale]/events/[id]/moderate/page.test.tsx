import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModeratePage from "./page";
import * as useImagesModule from "@/hooks/useImages";

const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ id: "event-1", locale: "en" })),
  useRouter: vi.fn(() => ({ back: mockBack })),
}));

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => {
    return (key: string, values?: Record<string, string | number>) => {
      if (key === "selectionDescription") {
        const count = Number(values?.count ?? 0);
        return `${count} photo${count === 1 ? "" : "s"} selected`;
      }

      if (!values) return key;

      return key.replace(/\{(\w+)\}/g, (_, token: string) =>
        String(values[token] ?? `{${token}}`)
      );
    };
  }),
}));

const mockUpdateImage = vi.fn(() => Promise.resolve({}));
const mockBatchUpdateImage = vi.fn(() => Promise.resolve({}));
const mockInvalidateQueries = vi.fn(() => Promise.resolve());

vi.mock("@tanstack/react-query", async importOriginal => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: mockInvalidateQueries,
    })),
  };
});

vi.mock("@/hooks/useImages", () => ({
  imagesKeys: {
    all: ["images"],
    event: (eventId?: string) => ["images", eventId],
  },
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
  useBatchUpdateImageMutation: vi.fn(() => ({
    mutateAsync: mockBatchUpdateImage,
  })),
}));

// Mock ModerateHeader
vi.mock("@/components/ModerateHeader", () => ({
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
}));

// Mock UI components to simplify testing
vi.mock("@flash/ui", () => ({
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
    state,
    onClick,
    ...rest
  }: {
    state: string;
    onClick: () => void;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`image-card-${rest["data-image-id"]}`}
      data-state={state}
      data-image-id={rest["data-image-id"]}
      onClick={onClick}
    />
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
  // Reset useImagesQuery to the default data after each test, since some tests
  // override it with mockReturnValue (e.g. the empty-state test) and
  // vi.clearAllMocks() does not reset mock return values / implementations.
  vi.mocked(useImagesModule.useImagesQuery).mockImplementation(
    () =>
      ({
        data: [
          { id: "img-1", eventId: "event-1", isApproved: null },
          { id: "img-2", eventId: "event-1", isApproved: null },
          { id: "img-3", eventId: "event-1", isApproved: null },
        ],
        isLoading: false,
      }) as unknown as ReturnType<typeof useImagesModule.useImagesQuery>
  );
  vi.mocked(useImagesModule.useUpdateImageMutation).mockImplementation(
    () =>
      ({
        mutateAsync: mockUpdateImage,
      }) as unknown as ReturnType<typeof useImagesModule.useUpdateImageMutation>
  );
  vi.mocked(useImagesModule.useBatchUpdateImageMutation).mockImplementation(
    () =>
      ({
        mutateAsync: mockBatchUpdateImage,
      }) as unknown as ReturnType<typeof useImagesModule.useBatchUpdateImageMutation>
  );
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

    fireEvent.click(screen.getByText("Select"));

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

    // Select an image via click
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

    // Click to select
    fireEvent.click(imageCard);
    expect(imageCard.getAttribute("data-state")).toBe("selected");

    // Click again to deselect
    fireEvent.click(imageCard);
    expect(imageCard.getAttribute("data-state")).toBe("default");
  });

  it("ActionCard is hidden when no images are selected; visible with correct count when >=1 selected", () => {
    render(<ModeratePage />);

    // No ActionCard initially
    expect(screen.queryByTestId("action-card")).toBeNull();

    // Enter select mode and select an image via click
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByTestId("image-card-img-1"));

    // ActionCard should be visible
    expect(screen.getByTestId("action-card")).toBeDefined();
    expect(screen.getByTestId("action-card-description").textContent).toBe(
      "1 photo selected"
    );

    // Select another via click
    fireEvent.click(screen.getByTestId("image-card-img-2"));
    expect(screen.getByTestId("action-card-description").textContent).toBe(
      "2 photos selected"
    );
  });

  it('clicking "Cancel" in header while images are selected exits select mode and clears the selection', () => {
    render(<ModeratePage />);

    // Enter select mode and select images via click
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

    expect(screen.getByText("emptyState.pending")).toBeDefined();
  });

  it("bulk approve calls updateImage with isApproved=true for each selected image and exits select mode", async () => {
    render(<ModeratePage />);

    // Enter select mode and select two images
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByTestId("image-card-img-1"));
    fireEvent.click(screen.getByTestId("image-card-img-2"));

    // Click primary action (Approve — we are on the pending tab)
    fireEvent.click(screen.getByTestId("primary-action"));

    await waitFor(() => {
      expect(mockBatchUpdateImage).toHaveBeenCalledTimes(1);
      expect(mockBatchUpdateImage).toHaveBeenCalledWith({
        eventId: "event-1",
        ids: ["img-1", "img-2"],
        isApproved: true,
      });
    });

    // Select mode should exit after successful bulk action
    await waitFor(() => {
      expect(screen.getByText("Select")).toBeDefined();
      expect(screen.queryByTestId("action-card")).toBeNull();
    });
  });

  it("bulk reject calls updateImage with isApproved=false for each selected image and exits select mode", async () => {
    render(<ModeratePage />);

    // Enter select mode and select one image
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByTestId("image-card-img-1"));

    // Click secondary action (Reject — we are on the pending tab)
    fireEvent.click(screen.getByTestId("secondary-action"));

    await waitFor(() => {
      expect(mockBatchUpdateImage).toHaveBeenCalledTimes(1);
      expect(mockBatchUpdateImage).toHaveBeenCalledWith({
        eventId: "event-1",
        ids: ["img-1"],
        isApproved: false,
      });
    });

    // Select mode should exit after successful bulk action
    await waitFor(() => {
      expect(screen.getByText("Select")).toBeDefined();
      expect(screen.queryByTestId("action-card")).toBeNull();
    });
  });
});
