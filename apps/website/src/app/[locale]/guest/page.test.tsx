import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";
import * as useFileUploadModule from "@/hooks/useFileUpload";
import { PhoneHeader, ActionCard } from "ui";

// Mock the UI components
vi.mock("ui", () => ({
  PhoneHeader: vi.fn(() => <div data-testid="phone-header">PhoneHeader</div>),
  ActionCard: vi.fn(() => <div data-testid="action-card">ActionCard</div>),
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
