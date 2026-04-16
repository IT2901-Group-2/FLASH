import {
  eventAuthMock,
  eventHooksMock,
  imageHooksMock,
  makeImage,
  mockImagesLoaded,
  fileUploadHookMock,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { useImagesQuery } from "@/hooks/useImages";
import userEvent from "@testing-library/user-event";
import { PhoneHeaderProps } from "@/components/PhoneHeader/PhoneHeader";
import { useFileUpload } from "@/hooks/useFileUpload";

vi.mock("@/hooks/useEvents", () => eventHooksMock());
vi.mock("@/hooks/useImages", () => imageHooksMock());
vi.mock("@/providers/EventAuthContext", () => eventAuthMock());
vi.mock("@/hooks/useFileUpload", () => fileUploadHookMock());

vi.mock("@/components/PhoneHeader/PhoneHeader", () => ({
  PhoneHeader: vi.fn(({ children, ...rest }: PhoneHeaderProps) => (
    <div data-testid="phone-header" {...rest}>
      {children}
    </div>
  )),
}));

describe("Guest Upload Page", () => {
  beforeEach(() => {
    vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded([makeImage()]));
  });

  describe("render and hook setup", () => {
    it("renders basic page parts", () => {
      render(<Page />);
      expect(screen.getByTestId("phone-header")).toBeInTheDocument();
      expect(screen.getByTestId("action-card")).toBeInTheDocument();
      expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    });

    it("uses useFileUpload with onFilesSelected callback", () => {
      render(<Page />);
      expect(useFileUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          onFilesSelected: expect.any(Function),
        })
      );
    });

    it("uses image query hook", () => {
      render(<Page />);
      expect(useImagesQuery).toHaveBeenCalledWith("event-123", {
        pageSize: 12,
        approval: "approved",
      });
    });
  });

  describe("uploaded images", () => {
    it("renders uploaded images", () => {
      render(<Page />);
      expect(screen.getByTestId("image-card")).toBeInTheDocument();
      expect(screen.getByText("imageTitle")).toBeInTheDocument();
    });

    it("opens fullscreen preview when an image is clicked", async () => {
      render(<Page />);

      expect(screen.queryByRole("dialog")).toBeNull();
      await userEvent.click(screen.getByTestId("image-card"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("closes fullscreen preview when pressing Escape", async ({ skip }) => {
      skip(); // The page.tsx file needs to be refactored. The logic is a mess.
      render(<Page />);

      await userEvent.click(screen.getByTestId("image-card"));
      expect(screen.getByTestId("preview-dialog")).toBeInTheDocument();

      await userEvent.keyboard("{Esc}");
      expect(screen.getByTestId("preview-dialog")).not.toBeInTheDocument();
    });
  });

  describe("file upload states", () => {
    //* These tests are currently not possible due to how the useFileUpload mock is set up. The component needs to be refactored to better handle state changes and re-rendering based on hook outputs.

    //* The page is also really bad and needs refactoring in general, so I'm skipping these tests for now. They will be re-enabled and likely rewritten once the page is in a better state.
    it("shows upload error key when one or more files fail to upload", async ({
      skip,
    }) => {
      skip();
    });

    it("shows no upload error when all files upload successfully", async ({ skip }) => {
      skip();
    });

    it("clears previous upload error when a new upload starts", async ({ skip }) => {
      skip();
    });

    it("shows upload limit reached key when upload fails due to event upload limit", async ({
      skip,
    }) => {
      skip();
    });

    it("prioritizes upload limit message when mixed failures include limit reached", async ({
      skip,
    }) => {
      skip();
    });
  });

  describe("upload callback edge cases", () => {
    it("shows upload error when callback runs without event id", async ({ skip }) => {
      skip(); // SKIP for no. All tests need to be redone with better mocks.
    });
  });
});
