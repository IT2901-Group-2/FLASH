import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import * as useEventsModule from "@/hooks/useEvents";
import * as uiModule from "ui";

// Mock the UI components
vi.mock("ui", () => ({
  PhoneHeader: vi.fn(() => <div data-testid="phone-header">PhoneHeader</div>),
  ActionCard: vi.fn(() => <div data-testid="action-card">ActionCard</div>),
}));

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: vi.fn(() => ({
    data: [
      {
        id: "event-1",
        name: "Test Event",
        description: "",
        guestCode: "ABC123",
        uploadLimit: 5,
      },
    ],
    isLoading: false,
    isError: false,
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
  it("passes fetched event data to PhoneHeader", () => {
    render(<Page />);

    const phoneHeaderMock = vi.mocked(uiModule.PhoneHeader);
    expect(phoneHeaderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Event",
        subtitle: "Code: ABC123",
        uploadsRemaining: 5,
      }),
      undefined
    );
  });

  it("passes uploads description to ActionCard", () => {
    render(<Page />);

    const actionCardMock = vi.mocked(uiModule.ActionCard);
    expect(actionCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "You have 5 uploads remaining",
      }),
      undefined
    );
  });

  it("uses loading title when event is still loading", () => {
    vi.mocked(useEventsModule.useEventsQuery).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useEventsModule.useEventsQuery>);

    render(<Page />);

    const phoneHeaderMock = vi.mocked(uiModule.PhoneHeader);
    expect(phoneHeaderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Loading event...",
      }),
      undefined
    );
  });

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
    expect(screen.getByTestId("phone-header")).toBeDefined();
    expect(screen.getByTestId("action-card")).toBeDefined();
  });

  it("should render PhoneHeader component", () => {
    render(<Page />);
    expect(screen.getByTestId("phone-header")).toBeDefined();
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
