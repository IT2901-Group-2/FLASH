import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFileUpload } from "../useFileUpload";
import { act } from "react";
import { makeMockFile, makeMockFiles } from "@test-config";
import userEvent from "@testing-library/user-event";

const setup = (opts?: Parameters<typeof useFileUpload>[0]) => {
  const { result } = renderHook(() => useFileUpload(opts));
  const { FileInput, openFilePicker } = result.current;
  render(FileInput());
  const input = document.querySelector("input[type='file']") as HTMLInputElement;
  return { input, openFilePicker };
};

describe("useFileUpload", () => {
  describe("return shape", () => {
    it("returns openFilePicker and FileInput", () => {
      const { result } = renderHook(() => useFileUpload());
      expect(typeof result.current.openFilePicker).toBe("function");
      expect(typeof result.current.FileInput).toBe("function");
    });
  });

  describe("FileInput component", () => {
    it("renders a hidden file input", () => {
      const { result } = renderHook(() => useFileUpload());
      render(result.current.FileInput());

      const input = screen.getByTestId("file-input") as HTMLInputElement;
      expect(input.tagName).toBe("INPUT");
      expect(input.type).toBe("file");
      expect(input.style.display).toBe("none");
    });

    it("applies the default accept value of image/*", () => {
      const { input } = setup();
      expect(input.accept).toBe("image/*");
    });

    it("applies a custom accept value", () => {
      const { input } = setup({ accept: ".pdf" });
      expect(input.accept).toBe(".pdf");
    });

    it("enables multiple by default", () => {
      const { input } = setup();
      expect(input.multiple).toBe(true);
    });

    it("disables multiple when multiple: false is passed", () => {
      const { input } = setup({ multiple: false });
      expect(input.multiple).toBe(false);
    });
  });

  describe("openFilePicker", () => {
    it("calls click() on the hidden input", () => {
      const { input, openFilePicker } = setup();
      const clickSpy = vi.spyOn(input, "click");

      act(() => openFilePicker());

      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it("does not throw when the ref is not yet attached", () => {
      const { result } = renderHook(() => useFileUpload());
      // FileInput is NOT rendered, so fileInputRef.current is null
      expect(() => act(() => result.current.openFilePicker())).not.toThrow();
    });
  });

  describe("onFilesSelected callback", () => {
    const onFilesSelected = vi.fn();

    it("calls onFilesSelected with the FileList when files are chosen", async () => {
      const { input } = setup({ onFilesSelected });
      const files = [makeMockFile()];
      await userEvent.upload(input, files);

      expect(onFilesSelected).toHaveBeenCalledOnce();
      expect(onFilesSelected).toHaveBeenCalledWith(files);
    });

    it("passes all selected files when multiple files are chosen", async () => {
      const { input } = setup({ onFilesSelected });
      const files = makeMockFiles(3);
      await userEvent.upload(input, files);

      expect(onFilesSelected).toHaveBeenCalledOnce();
      expect(onFilesSelected).toHaveBeenCalledWith(files);
    });

    it("does not call onFilesSelected when no files are selected", async () => {
      const { input } = setup({ onFilesSelected });
      await userEvent.upload(input, []);
      expect(onFilesSelected).not.toHaveBeenCalled();
    });

    it("does not throw when onFilesSelected is not provided", async () => {
      const { input } = setup();
      expect(() => userEvent.upload(input, makeMockFiles(2))).not.toThrow();
    });
  });

  describe("input reset after selection", () => {
    it("resets the input value to empty string after files are selected", async () => {
      const { input } = setup({ onFilesSelected: vi.fn() });
      await userEvent.upload(input, makeMockFiles(1));
      expect(input.value).toBe("");
    });

    it("resets the input value even when onFilesSelected is not provided", async () => {
      const { input } = setup();
      await userEvent.upload(input, makeMockFiles(1));
      expect(input.value).toBe("");
    });
  });
});
