import {
  imageHooksMock,
  imageCardMock,
  makeImages,
  mockImagesLoaded,
  renderWithQuery,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import ModeratePage from "./page";
import { useBatchUpdateImageMutation, useImagesQuery } from "@/hooks/useImages";
import { PHOTOS_REFETCH_INTERVAL } from "@/config/images";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useImages", () => imageHooksMock());
vi.mock("@/components/ImageCard/ImageCard", () => imageCardMock());
vi.mock("@flash/ui", async importOriginal => {
  const actual = await importOriginal<typeof import("@flash/ui")>();
  return { ...actual, useToast: () => ({ createToast: vi.fn() }) };
});

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

describe("ModeratePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded(makeImages(3)));
  });

  describe("tabs and filtering", () => {
    it("renders three segmented control tabs that defaults to Pending", () => {
      renderWithQuery(<ModeratePage />);

      expect(screen.getByText("tabs.pending").parentNode).toBeInTheDocument();
      expect(screen.getByText("tabs.approved").parentNode).toBeInTheDocument();
      expect(screen.getByText("tabs.rejected").parentNode).toBeInTheDocument();

      expect(screen.getByText("tabs.pending").parentNode).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    it("updates the displayed images to match the selected status when switching tabs ", async () => {
      renderWithQuery(<ModeratePage />);

      expect(useImagesQuery).toHaveBeenCalledWith(
        "event-123",
        { approval: "pending" },
        undefined,
        PHOTOS_REFETCH_INTERVAL
      );
      await userEvent.click(screen.getByText("tabs.approved"));
      expect(useImagesQuery).toHaveBeenCalledWith(
        "event-123",
        { approval: "approved" },
        undefined,
        PHOTOS_REFETCH_INTERVAL
      );
    });

    it("cannot switch tabs while in select mode", async () => {
      renderWithQuery(<ModeratePage />);
      const approvedTab = screen.getByText("tabs.approved");

      await userEvent.click(screen.getByText("Select")); // Enter select mode
      expect(approvedTab.parentNode).toBeDisabled(); // Try clicking a tab
      await userEvent.click(approvedTab); // Click the disabled tab

      expect(screen.getByText("tabs.pending").parentNode).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    it("empty state renders when the active tab has zero images", async () => {
      vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded([]));
      renderWithQuery(<ModeratePage />);
      expect(screen.getByText("emptyState.pending")).toBeDefined();
    });
  });

  describe("select mode", () => {
    it('enters select mode when clicking "Select"', async () => {
      renderWithQuery(<ModeratePage />);

      await userEvent.click(screen.getByText("Select"));

      expect(screen.getByText("Cancel")).toBeInTheDocument(); // Button should now say "Cancel"
      expect(screen.getByText("tabs.pending").parentNode).toBeDisabled();
      expect(screen.getByText("tabs.approved").parentNode).toBeDisabled();
      expect(screen.getByText("tabs.rejected").parentNode).toBeDisabled();
    });

    it("re-anables tabs, clears selection, and exits select mode when clicking cancel", async () => {
      renderWithQuery(<ModeratePage />);

      await userEvent.click(screen.getByText("Select")); // Enter select mode
      await userEvent.click(screen.getByTestId("image-1")); // Select an image via click
      await userEvent.click(screen.getByText("Cancel")); // Click Cancel

      expect(screen.getByText("Select")).toBeDefined(); // Button should revert to "Select"
      expect(screen.getByText("tabs.pending")).not.toBeDisabled(); // Tabs should be re-enabled
      expect(screen.getByTestId("image-1").getAttribute("data-state")).toBe("default");
    });

    it("tapping an image in select mode toggles its selected state", async () => {
      renderWithQuery(<ModeratePage />);
      const imageCard = screen.getByTestId("image-1");

      await userEvent.click(screen.getByText("Select"));
      await userEvent.click(imageCard);

      expect(imageCard.getAttribute("data-state")).toBe("selected");
      await userEvent.click(imageCard);
      expect(imageCard.getAttribute("data-state")).toBe("default");
    });

    it('clears the selection and exits when clicking "Cancel"', async () => {
      renderWithQuery(<ModeratePage />);

      await userEvent.click(screen.getByText("Select"));
      await userEvent.click(screen.getByTestId("image-1"));
      await userEvent.click(screen.getByTestId("image-2"));

      expect(screen.getByTestId("action-card")).toBeInTheDocument();

      await userEvent.click(screen.getByText("Cancel")); // Click Cancel in header

      expect(screen.queryByTestId("action-card")).not.toBeInTheDocument();
      expect(screen.getByTestId("image-1")).toHaveAttribute("data-state", "default");
    });
  });

  describe("bulk actions", () => {
    it(" hides ActionCard when no images are selected", async () => {
      renderWithQuery(<ModeratePage />);

      // No ActionCard initially
      expect(screen.queryByTestId("action-card")).toBeNull();

      // Enter select mode and select an image via click
      await userEvent.click(screen.getByText("Select"));
      await userEvent.click(screen.getByTestId("image-1"));

      // ActionCard should be visible
      expect(screen.getByTestId("action-card")).toBeDefined();
      expect(screen.getByText("selectionDescription")).toBeInTheDocument();

      // Select another via click
      await userEvent.click(screen.getByTestId("image-2"));
      expect(screen.getByText("selectionDescription")).toBeInTheDocument();
    });

    it("bulk approves calls updateImage", async () => {
      const { mutateAsync } = useBatchUpdateImageMutation();
      renderWithQuery(<ModeratePage />);

      // Enter select mode and select two images
      await userEvent.click(screen.getByText("Select"));
      await userEvent.click(screen.getByTestId("image-1"));
      await userEvent.click(screen.getByTestId("image-2"));
      await userEvent.click(screen.getByText("actions.approveSelected"));

      expect(mutateAsync).toHaveBeenCalledTimes(1);
      expect(mutateAsync).toHaveBeenCalledWith({
        eventId: "event-123",
        ids: ["image-1", "image-2"],
        isApproved: true,
      });

      // Select mode should exit after successful bulk action
      await waitFor(() => {
        expect(screen.getByText("Select")).toBeDefined();
        expect(screen.queryByTestId("action-card")).toBeNull();
      });
    });

    it("bulk rejects calls updateImage", async () => {
      const { mutateAsync } = useBatchUpdateImageMutation();

      renderWithQuery(<ModeratePage />);

      // Enter select mode and select one image
      await userEvent.click(screen.getByText("Select"));
      await userEvent.click(screen.getByTestId("image-1"));
      await userEvent.click(screen.getByText("actions.rejectSelected"));

      expect(mutateAsync).toHaveBeenCalledTimes(1);
      expect(mutateAsync).toHaveBeenCalledWith({
        eventId: "event-123",
        ids: ["image-1"],
        isApproved: false,
      });

      // Select mode should exit after successful bulk action
      await waitFor(() => {
        expect(screen.getByText("Select")).toBeDefined();
        expect(screen.queryByTestId("action-card")).not.toBeInTheDocument();
      });
    });
  });
});
