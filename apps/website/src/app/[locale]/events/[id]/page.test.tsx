import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import * as useEventsModule from "@/hooks/useEvents";
import { Event } from "@/db";

// Mock the UI components
vi.mock("ui", () => ({
  ActionCard: vi.fn(() => <div data-testid="action-card">ActionCard</div>),
  Dialog: vi.fn(() => <div data-testid="dialog">Dialog</div>),
  QRDisplay: vi.fn(() => <div data-testid="qr-display">QRDisplay</div>),
  Button: vi.fn(() => <button data-testid="button">Button</button>),
  Title: vi.fn(() => <h1 data-testid="title">Title</h1>),
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

vi.mock("@/providers/EventAuthContext", () => ({
  useEventAuth: vi.fn(() => ({
    isAuthenticated: true,
    nickname: "test-user",
    isModerator: false,
  })),
}));

const mockOpenFilePicker = vi.fn();
const mockFileInput = () => <input type="file" data-testid="file-input" />;

// Mock the useFileUpload hook
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
  it("renders fallback error message when event fails to load", () => {
    vi.mocked(useEventsModule.useEventsQuery).mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useEventsModule.useEventsQuery>);

    render(<Page />);

    expect(screen.getByText("Could not load event details for this link.")).toBeDefined();
  });

  it("should render without crashing", () => {
    render(<Page />);
    expect(screen.getByTestId("action-card")).toBeDefined();
  });

  it("should render ActionCard component", () => {
    render(<Page />);
    expect(screen.getByTestId("action-card")).toBeDefined();
  });

  it("should render file input from useFileUpload hook", () => {
    render(<Page />);
    const fileInput = screen.getByTestId("file-input");
    expect(fileInput).toBeDefined();
    expect(fileInput.getAttribute("type")).toBe("file");
  });

  it("should use useFileUpload hook", () => {
    render(<Page />);
    expect(useFileUploadModule.useFileUpload).toHaveBeenCalled();
  });

  it("should call useFileUpload with onFilesSelected callback", () => {
    render(<Page />);
    expect(useFileUploadModule.useFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        onFilesSelected: expect.any(Function),
      })
    );
  });

  it("should execute onFilesSelected callback when files are selected", () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<Page />);

    // Get the onFilesSelected callback that was passed to useFileUpload
    const useFileUploadCall = vi.mocked(useFileUploadModule.useFileUpload).mock.calls[0];
    const options = useFileUploadCall?.[0];
    const onFilesSelected = options?.onFilesSelected;

    // Create a mock FileList
    const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
      [Symbol.iterator]: function* () {
        yield mockFile;
      },
    } as FileList;

    // Call it with mock FileList
    if (onFilesSelected) {
      onFilesSelected(mockFileList);
    }

    expect(consoleSpy).toHaveBeenCalledWith("Selected files:", mockFileList);
    consoleSpy.mockRestore();
  });
});
