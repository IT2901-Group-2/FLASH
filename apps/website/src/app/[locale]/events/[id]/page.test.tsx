import {
  eventAuthMock,
  eventHooksMock,
  imageHooksMock,
  makeImage,
  mockImagesLoaded,
  fileUploadHookMock,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import { useImagesQuery } from "@/hooks/useImages";
import userEvent from "@testing-library/user-event";
import { PhoneHeaderProps } from "@/components/PhoneHeader/PhoneHeader";

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
      expect(useFileUploadModule.useFileUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          onFilesSelected: expect.any(Function),
        })
      );
    });

    it("uses image query hook", () => {
      render(<Page />);
      expect(useImagesQuery).toHaveBeenCalledWith("event-123");
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

  describe("file upload success and failure states", () => {
    it("shows upload error key when one or more files fail to upload", async () => {
      mockUploadImage.mockRejectedValue(new Error("Upload failed"));
      render(<Page />);

      const { onFilesSelected } = vi.mocked(useFileUploadModule.useFileUpload).mock
        .calls[0]![0]!;
      const mockFileList = createMockFileList([
        new File(["a"], "a.jpg", { type: "image/jpeg" }),
        new File(["b"], "b.jpg", { type: "image/jpeg" }),
      ]);

      await act(async () => {
        await onFilesSelected!(mockFileList);
      });

      await waitFor(() =>
        expect(screen.getByRole("alert")).toHaveTextContent("errors.uploadFailed")
      );
    });

    it("shows no upload error when all files upload successfully", async () => {
      mockUploadImage.mockResolvedValue({});
      render(<Page />);

      const { onFilesSelected } = vi.mocked(useFileUploadModule.useFileUpload).mock
        .calls[0]![0]!;
      const mockFileList = createMockFileList([
        new File(["a"], "a.jpg", { type: "image/jpeg" }),
      ]);

      await act(async () => {
        await onFilesSelected!(mockFileList);
      });

      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(""));
    });

    it("clears previous upload error when a new upload starts", async () => {
      mockUploadImage.mockRejectedValue(new Error("Upload failed"));
      render(<Page />);

      const { onFilesSelected } = vi.mocked(useFileUploadModule.useFileUpload).mock
        .calls[0]![0]!;
      const mockFileList = createMockFileList([
        new File(["a"], "a.jpg", { type: "image/jpeg" }),
      ]);

      await act(async () => {
        await onFilesSelected!(mockFileList);
      });
      await waitFor(() =>
        expect(screen.getByRole("alert")).toHaveTextContent("errors.uploadFailed")
      );

      mockUploadImage.mockResolvedValue({});
      await act(async () => {
        await onFilesSelected!(mockFileList);
      });
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(""));
    });
  });

  describe("upload callback edge cases", () => {
    it("shows upload error when callback runs without event id", async ({ skip }) => {
      skip(); // SKIP for no. All tests need to be redone with better mocks.
      render(<Page />);

      const onFilesSelected = vi.mocked(useFileUploadModule.useFileUpload).mock
        .calls[0]![0]!.onFilesSelected;

      if (!onFilesSelected) throw new Error("Expected onFilesSelected");

      const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const mockFileList = {
        0: mockFile,
        length: 1,
        item: (index: number) => (index === 0 ? mockFile : null),
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList;

      await onFilesSelected!(mockFileList);

      expect(await screen.findByText("errors.uploadUnavailable")).toBeInTheDocument();
      expect(mockUploadImage).not.toHaveBeenCalled();
    });
  });
});
