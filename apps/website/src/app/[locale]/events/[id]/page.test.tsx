import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, act, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import * as useEventsModule from "@/hooks/useEvents";
import * as useImagesModule from "@/hooks/useImages";
import { Event, Image } from "@/db";

vi.mock("@flash/ui", () => ({
  ActionCard: vi.fn(() => <div data-testid="action-card">ActionCard</div>),
  ImageCard: vi.fn(({ title, onClick }: { title: string; onClick?: () => void }) => (
    <button data-testid="image-card" onClick={onClick}>
      {title}
    </button>
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
    data: {
      pages: [
        {
          items: [
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
          nextCursor: null,
        },
      ],
      pageParams: [undefined],
    },
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
  useInfiniteImagesQuery: vi.fn(() => ({
    data: {
      pages: [
        {
          items: [
            {
              id: "image-1",
              eventId: "event-1",
              userId: "user-1",
              isApproved: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ] satisfies Image[],
          nextCursor: null,
        },
      ],
      pageParams: [undefined],
    },
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
    isLoading: false,
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

function createMockFileList(files: File[]): FileList {
  return {
    ...files,
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* () {
      yield* files;
    },
  } as unknown as FileList;
}

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

  it("opens fullscreen preview when an image is clicked", () => {
    render(<Page />);

    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByTestId("image-card"));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("closes fullscreen preview when pressing Escape", async () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId("image-card"));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("uses image query hook", () => {
    render(<Page />);
    expect(useImagesModule.useInfiniteImagesQuery).toHaveBeenCalledWith("event-123", {
      pageSize: 12,
    });
  });

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

    expect(await screen.findByText("errors.uploadUnavailable")).toBeDefined();
    expect(mockUploadImage).not.toHaveBeenCalled();
  });
});
