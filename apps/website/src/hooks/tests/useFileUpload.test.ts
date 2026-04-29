import {
  createQueryClientWrapper,
  makeEvent,
  makeMockFile,
  makeMockFiles,
} from "@test-config";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileUploadOptions, useFileUpload } from "../useFileUpload";
import { act } from "react";
import userEvent from "@testing-library/user-event";

const wrapper = createQueryClientWrapper();
const event = makeEvent();

const DEFAULT_OPTIONS = {
  eventId: "event-1",
  accept: ["image/*"],
} satisfies FileUploadOptions;

const setup = (opts?: Partial<FileUploadOptions>) => {
  const { result } = renderHook(() => useFileUpload({ ...opts, eventId: event.id }), {
    wrapper,
  });
  const { FileInput, ...rest } = result.current;
  render(FileInput());
  const input = document.querySelector("input[type='file']") as HTMLInputElement;
  return { input, FileInput, ...rest };
};

describe("useFileUpload", () => {
  describe("initial state", () => {
    it("starts idle with no uploaded files or errors", () => {
      const { result } = renderHook(() => useFileUpload(DEFAULT_OPTIONS), { wrapper });

      expect(result.current.status).toBe("idle");
      expect(result.current.isUploading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.uploadedFiles).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("returns the expected API surface", () => {
      const { result } = renderHook(() => useFileUpload(DEFAULT_OPTIONS), { wrapper });

      expect(typeof result.current.FileInput).toBe("function");
      expect(typeof result.current.openFilePicker).toBe("function");
      expect(typeof result.current.removeFile).toBe("function");
      expect(typeof result.current.reset).toBe("function");
    });
  });

  describe("FileInput component", () => {
    it("renders a hidden file input", () => {
      const { result } = renderHook(() => useFileUpload({ eventId: event.id }), {
        wrapper,
      });
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
      const { input } = setup({ accept: [".pdf"] });
      expect(input.accept).toBe(".pdf");
    });

    it("enables multiple by default", () => {
      const { input } = setup();
      expect(input.multiple).toBe(false);
    });

    it("disables multiple when multiple: true is passed", () => {
      const { input } = setup({ multiple: true });
      expect(input.multiple).toBe(true);
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
      const { result } = renderHook(() => useFileUpload({ eventId: event.id }), {
        wrapper,
      });
      // FileInput is NOT rendered, so fileInputRef.current is null
      expect(() => act(() => result.current.openFilePicker())).not.toThrow();
    });
  });

  describe("onAllUploaded callback", () => {
    const onAllUploaded = vi.fn();

    it("calls onAllUploaded with the FileList when files are chosen", async () => {
      const { input } = setup({ onAllUploaded });
      const files = [makeMockFile()];
      await userEvent.upload(input, files);

      expect(onAllUploaded).toHaveBeenCalledOnce();
      expect(onAllUploaded).toHaveBeenCalledWith(files);
    });

    it("passes all selected files when multiple files are chosen", async () => {
      const { input } = setup({ onAllUploaded });
      const files = makeMockFiles(3);
      await userEvent.upload(input, files);

      expect(onAllUploaded).toHaveBeenCalledOnce();
      expect(onAllUploaded).toHaveBeenCalledWith(files);
    });

    it("does not call onAllUploaded when no files are selected", async () => {
      const { input } = setup({ onAllUploaded });
      await userEvent.upload(input, []);
      expect(onAllUploaded).not.toHaveBeenCalled();
    });

    it("does not throw when onAllUploaded is not provided", async () => {
      const { input } = setup();
      expect(() => userEvent.upload(input, makeMockFiles(2))).not.toThrow();
    });
  });

  describe("input reset after selection", () => {
    it("resets the input value to empty string after files are selected", async () => {
      const { input } = setup();
      await userEvent.upload(input, makeMockFiles(1));
      expect(input.value).toBe("");
    });
  });
});
