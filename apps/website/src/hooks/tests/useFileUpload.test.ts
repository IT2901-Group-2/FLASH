import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFileUpload } from "../useFileUpload";
import { act } from "react";
import { makeMockFile, makeMockFiles } from "@test-config";
import userEvent from "@testing-library/user-event";

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
      const { FileInput } = result.current;
      render(FileInput());

      const input = screen.getByTestId("file-input") as HTMLInputElement;
      expect(input.tagName).toBe("INPUT");
      expect(input.type).toBe("file");
      expect(input.style.display).toBe("none");
    });

    it("applies the default accept value of image/*", () => {
      const { result } = renderHook(() => useFileUpload());
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      expect(input.accept).toBe("image/*");
    });

    it("applies a custom accept value", () => {
      const { result } = renderHook(() => useFileUpload({ accept: ".pdf" }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      expect(input.accept).toBe(".pdf");
    });

    it("enables multiple by default", () => {
      const { result } = renderHook(() => useFileUpload());
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      expect(input.multiple).toBe(true);
    });

    it("disables multiple when multiple: false is passed", () => {
      const { result } = renderHook(() => useFileUpload({ multiple: false }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      expect(input.multiple).toBe(false);
    });
  });

  describe("openFilePicker", () => {
    it("calls click() on the hidden input", () => {
      const { result } = renderHook(() => useFileUpload());
      const { FileInput, openFilePicker } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
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
    it("calls onFilesSelected with the FileList when files are chosen", () => {
      const onFilesSelected = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onFilesSelected }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      const files = [makeMockFile()];

      act(() => userEvent.upload(input, files));

      expect(onFilesSelected).toHaveBeenCalledOnce();
      expect(onFilesSelected).toHaveBeenCalledWith(files);
    });

    it("passes all selected files when multiple files are chosen", () => {
      const onFilesSelected = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onFilesSelected }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      const files = makeMockFiles(3);

      act(() => userEvent.upload(input, files));

      expect(onFilesSelected).toHaveBeenCalledOnce();
      expect(onFilesSelected).toHaveBeenCalledWith(files);
    });

    it("does not call onFilesSelected when no files are selected", () => {
      const onFilesSelected = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onFilesSelected }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;

      act(() => userEvent.upload(input, []));

      expect(onFilesSelected).not.toHaveBeenCalled();
    });

    it("does not throw when onFilesSelected is not provided", () => {
      const { result } = renderHook(() => useFileUpload());
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      const files = makeMockFiles(2);

      expect(() => act(() => userEvent.upload(input, files))).not.toThrow();
    });
  });

  describe("input reset after selection", () => {
    it("resets the input value to empty string after files are selected", () => {
      const { result } = renderHook(() => useFileUpload({ onFilesSelected: vi.fn() }));
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      const files = makeMockFiles(1);

      act(() => userEvent.upload(input, files));

      expect(input.value).toBe("");
    });

    it("resets the input value even when onFilesSelected is not provided", () => {
      const { result } = renderHook(() => useFileUpload());
      const { FileInput } = result.current;
      render(FileInput());

      const input = document.querySelector("input[type='file']") as HTMLInputElement;
      const files = makeMockFiles(1);

      act(() => userEvent.upload(input, files));

      expect(input.value).toBe("");
    });
  });
});
