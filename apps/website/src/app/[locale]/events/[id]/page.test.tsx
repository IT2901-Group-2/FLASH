import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import * as useEventsModule from "@/hooks/useEvents";
import * as useImagesModule from "@/hooks/useImages";
import { Event, Image } from "@/db";

vi.mock("ui", () => ({
  ActionCard: vi.fn(() => <div data-testid="action-card">ActionCard</div>),
  ImageCard: vi.fn(({ title }: { title: string }) => (
    <div data-testid="image-card">{title}</div>
  )),
  Dialog: vi.fn(() => <div data-testid="dialog">Dialog</div>),
  QRDisplay: vi.fn(() => <div data-testid="qr-display">QRDisplay</div>),
  Button: vi.fn(() => <button data-testid="button">Button</button>),
}));

vi.mock("@/components/PhoneHeader/PhoneHeader", () => ({
  PhoneHeader: vi.fn(({ children }: { children?: ReactNode }) => (
    <div data-testid="phone-header">{children}</div>
  )),
}));

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: vi.fn(() => ({
    data: [
      {
        id: "event-1",
        name: "Test Event",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        uploadLimit: 5,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] satisfies Event[],
    isLoading: false,
    isError: false,
  })),

  useEventCodeQuery: vi.fn(() => ({
    data: "ABC123",
    isLoading: false,
    isError: false,
  })),
}));

const mockUploadImage = vi.fn();

vi.mock("@/hooks/useImages", () => ({
  useUploadImageMutation: vi.fn(() => ({
    mutateAsync: mockUploadImage,
  })),
  useImagesQuery: vi.fn(() => ({
    data: [
      {
        id: "image-1",
        eventId: "event-1",
        userId: "user-1",
        isApproved: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] satisfies Image[],
  })),
}));

vi.mock("@/providers/EventAuthContext", () => ({
  useEventAuth: vi.fn(() => ({
    isAuthenticated: true,
    nickname: "test-user",
    isModerator: false,
  })),
}));

const mockOpenFilePicker = vi.fn();
const mockFileInput = () => <input type="file" data-testid="file-input" />;

vi.mock("@/hooks/useFileUpload", () => ({
  useFileUpload: vi.fn(() => ({
    openFilePicker: mockOpenFilePicker,
    FileInput: mockFileInput,
  })),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Guest Upload Page", () => {
  it("renders fallback error message when event fails to load", async () => {
    vi.mocked(useEventsModule.useEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useEventsModule.useEventsQuery>);

    render(<Page />);

    await waitFor(() => expect(screen.getByText("eventLoadFailed")).toBeDefined());
  });

  it("renders basic page parts", () => {
    render(<Page />);
    expect(screen.getByTestId("phone-header")).toBeDefined();
    expect(screen.getByTestId("action-card")).toBeDefined();
    expect(screen.getByTestId("file-input")).toBeDefined();
  });

  it("uses useFileUpload with onFilesSelected callback", () => {
    render(<Page />);
    expect(useFileUploadModule.useFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        onFilesSelected: expect.any(Function),
      })
    );
  });

  it("renders uploaded images", () => {
    render(<Page />);
    expect(screen.getByTestId("image-card")).toBeDefined();
    expect(screen.getByText("imageTitle")).toBeDefined();
  });

  it("uses image query hook", () => {
    render(<Page />);
    expect(useImagesModule.useImagesQuery).toHaveBeenCalledWith("");
  });

  it("shows upload error when callback runs without event id", async () => {
    render(<Page />);

    const useFileUploadCall = vi.mocked(useFileUploadModule.useFileUpload).mock.calls[0];
    const options = useFileUploadCall?.[0];
    const onFilesSelected = options?.onFilesSelected;

    const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
      [Symbol.iterator]: function* () {
        yield mockFile;
      },
    } as FileList;

    if (onFilesSelected) {
      await onFilesSelected(mockFileList);
    }

    expect(await screen.findByText("errors.uploadUnavailable")).toBeDefined();
    expect(mockUploadImage).not.toHaveBeenCalled();
  });
});
