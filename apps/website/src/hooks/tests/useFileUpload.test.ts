import {
  defaultUploadImageMutationReturn,
  imageHooksMock,
  makeImage,
  makeMockFile,
  makeMockFileList,
} from "@test-config";
import { renderHook, act, waitFor, render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useUploadImageMutation } from "@/hooks/useImages";
import { Image } from "@/db";

vi.mock("@/hooks/useImages", () => imageHooksMock());

const EVENT_ID = "event-123";
function fireInputChange(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, "files", {
    value: makeMockFileList(...files),
    configurable: true,
  });
  fireEvent.change(input);
}

function setup(options: Partial<Parameters<typeof useFileUpload>[0]> = {}) {
  const { result } = renderHook(() => useFileUpload({ eventId: EVENT_ID, ...options }));
  render(result.current.FileInput());
  const input = document.querySelector("input[type='file']") as HTMLInputElement;
  return { result, input };
}

describe("useFileUpload", () => {
  let uploadedImage: Image;
  let mockMutateAsync: Mock;

  beforeEach(() => {
    uploadedImage = makeImage({ eventId: EVENT_ID });
    mockMutateAsync = vi.fn().mockResolvedValue(uploadedImage);
    vi.mocked(useUploadImageMutation).mockReturnValue({
      ...defaultUploadImageMutationReturn,
      mutateAsync: mockMutateAsync,
    });
  });

  describe("initial state", () => {
    it("returns idle status", () => {
      const { result } = setup();
      expect(result.current.status).toBe("idle");
    });

    it("returns empty uploadedFiles array", () => {
      const { result } = setup();
      expect(result.current.uploadedFiles).toEqual([]);
    });

    it("returns null error", () => {
      const { result } = setup();
      expect(result.current.error).toBeNull();
    });

    it("returns correct boolean flags", () => {
      const { result } = setup();
      expect(result.current.isUploading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe("FileInput component", () => {
    it("renders a hidden file input", () => {
      const { input } = setup();
      expect(input).not.toBeNull();
      expect(input.style.display).toBe("none");
    });

    it("passes accept types to the input", () => {
      const { input } = setup({ accept: ["image/png", "image/jpeg"] });
      expect(input.accept).toBe("image/png,image/jpeg");
    });

    it("passes multiple prop to the input", () => {
      const { input } = setup({ multiple: true });
      expect(input.multiple).toBe(true);
    });

    it("defaults multiple to false", () => {
      const { input } = setup();
      expect(input.multiple).toBe(false);
    });

    it("has the correct data-testid", () => {
      const { input } = setup();
      expect(input.dataset.testid).toBe("file-input");
    });
  });

  describe("openFilePicker", () => {
    it("is a function", () => {
      const { result } = setup();
      expect(result.current.openFilePicker).toBeTypeOf("function");
    });

    it("triggers a click on the hidden input", () => {
      const { result, input } = setup();
      const mockClick = vi.spyOn(input, "click");
      act(() => result.current.openFilePicker());
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("successful upload", () => {
    it("sets status to success after upload", async () => {
      const { result, input } = setup();
      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => expect(result.current.status).toBe("success"));
    });

    it("appends the uploaded file to uploadedFiles", async () => {
      const { result, input } = setup();
      const file = makeMockFile();

      fireInputChange(input, [file]);

      await waitFor(() => {
        expect(result.current.uploadedFiles).toHaveLength(1);
        expect(result.current.uploadedFiles[0]!.data).toEqual(uploadedImage);
        expect(result.current.uploadedFiles[0]!.file).toEqual(file);
      });
    });

    it("sets isSuccess to true", async () => {
      const { result, input } = setup();

      fireInputChange(input, [makeMockFile()]);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("calls onUpload callback with the uploaded file info", async () => {
      const onUpload = vi.fn();
      const { input } = setup({ onUpload });
      const file = makeMockFile();

      fireInputChange(input, [file]);

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith({ file, data: uploadedImage });
      });
    });

    it("calls onAllUploaded after all files finish", async () => {
      const onAllUploaded = vi.fn();
      const { input } = setup({ onAllUploaded });

      fireInputChange(input, [makeMockFile()]);

      await waitFor(() => expect(onAllUploaded).toHaveBeenCalledTimes(1));
    });

    it("passes eventId and file to the upload mutation", async () => {
      const { input } = setup();
      const file = makeMockFile();
      fireInputChange(input, [file]);
      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({ eventId: EVENT_ID, file });
      });
    });
  });

  describe("upload failure", () => {
    it("sets status to error on upload failure", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockRejectedValue(new Error("Network error")),
      });

      const { result, input } = setup();
      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => {
        expect(result.current.status).toBe("error");
        expect(result.current.isError).toBe(true);
      });
    });

    it("sets error with UPLOAD_FAILED code and the error message", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockRejectedValue(new Error("Server down")),
      });

      const { result, input } = setup();
      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => {
        expect(result.current.error?.code).toBe("UPLOAD_FAILED");
        expect(result.current.error?.message).toBe("Server down");
      });
    });

    it("attaches the failing file to the error object", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockRejectedValue(new Error("Forbidden")),
      });

      const { result, input } = setup();
      const file = makeMockFile({ name: "photo.jpg" });
      fireInputChange(input, [file]);
      await waitFor(() => expect(result.current.error?.file).toEqual(file));
    });

    it("uses translated fallback message when rejection is not an Error instance", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockRejectedValue(new Error("uploadFailed")),
      });

      const { result, input } = setup();
      fireInputChange(input, [makeMockFile({ name: "photo.jpg" })]);
      await waitFor(() => {
        expect(result.current.error?.message).toBe("uploadFailed");
      });
    });

    it("calls onError callback on upload failure", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockRejectedValue(new Error("Forbidden")),
      });

      const onError = vi.fn();
      const { input } = setup({ onError });
      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({ code: "UPLOAD_FAILED" })
        );
      });
    });
  });

  describe("validation", () => {
    it("sets TOO_MANY_FILES error when file count exceeds maxFiles", () => {
      const { result, input } = setup({ maxFiles: 2 });
      fireInputChange(input, [makeMockFile(), makeMockFile(), makeMockFile()]);
      expect(result.current.error?.code).toBe("TOO_MANY_FILES");
      expect(result.current.status).toBe("error");
    });

    it("includes the max count in the error message", () => {
      const { result, input } = setup({ maxFiles: 2 });
      fireInputChange(input, [makeMockFile(), makeMockFile(), makeMockFile()]);
      expect(result.current.error?.message).toBe("tooManyFiles");
    });

    it("calls onError with TOO_MANY_FILES when file count exceeds maxFiles", () => {
      const onError = vi.fn();
      const { input } = setup({ maxFiles: 1, onError });
      fireInputChange(input, [makeMockFile(), makeMockFile()]);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "TOO_MANY_FILES" })
      );
    });

    it("does not call the upload mutation when validation fails", () => {
      const { input } = setup({ maxFiles: 1 });
      fireInputChange(input, [makeMockFile(), makeMockFile()]);
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("allows exactly maxFiles files without error", () => {
      const { result, input } = setup({ maxFiles: 2 });
      fireInputChange(input, [makeMockFile(), makeMockFile()]);
      expect(result.current.error).toBeNull();
    });

    it("does nothing when the file list is empty", () => {
      const { result, input } = setup();
      fireInputChange(input, []);
      expect(mockMutateAsync).not.toHaveBeenCalled();
      expect(result.current.status).toBe("idle");
    });
  });

  describe("removeFile", () => {
    it("removes the matching file from uploadedFiles by id", async () => {
      const imageA = makeImage({ id: "img-a" });
      const imageB = makeImage({ id: "img-b" });
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi.fn().mockResolvedValueOnce(imageA).mockResolvedValueOnce(imageB),
      });

      const { result, input } = setup({ multiple: true });

      fireInputChange(input, [
        makeMockFile({ name: "a.jpg" }),
        makeMockFile({ name: "b.jpg" }),
      ]);

      await waitFor(() => expect(result.current.uploadedFiles).toHaveLength(2));

      act(() => result.current.removeFile("img-a"));

      expect(result.current.uploadedFiles).toHaveLength(1);
      expect(result.current.uploadedFiles[0]!.data.id).toBe("img-b");
    });

    it("does nothing when removing a non-existent id", async () => {
      const { result, input } = setup();

      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => expect(result.current.uploadedFiles).toHaveLength(1));
      act(() => result.current.removeFile("non-existent-id"));
      expect(result.current.uploadedFiles).toHaveLength(1);
    });
  });

  describe("reset", () => {
    it("clears uploadedFiles", async () => {
      const { result, input } = setup();

      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => expect(result.current.uploadedFiles).toHaveLength(1));

      act(() => result.current.reset());
      expect(result.current.uploadedFiles).toEqual([]);
    });

    it("resets status to idle", async () => {
      const { result, input } = setup();

      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      act(() => result.current.reset());
      expect(result.current.status).toBe("idle");
    });

    it("clears the error state", () => {
      const { result, input } = setup({ maxFiles: 1 });

      fireInputChange(input, [makeMockFile(), makeMockFile()]);
      expect(result.current.isError).toBe(true);

      act(() => result.current.reset());

      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });

    it("resets all boolean flags to false", async () => {
      const { result, input } = setup();

      fireInputChange(input, [makeMockFile()]);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      act(() => result.current.reset());
      expect(result.current.isUploading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe("multiple file uploads", () => {
    it("calls the upload mutation once per file", async () => {
      const mockMutateAsync = vi
        .fn()
        .mockResolvedValueOnce(makeImage({ id: "img-1" }))
        .mockResolvedValueOnce(makeImage({ id: "img-2" }));

      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: mockMutateAsync,
      });

      const { input } = setup({ multiple: true });

      fireInputChange(input, [
        makeMockFile({ name: "a.jpg" }),
        makeMockFile({ name: "b.jpg" }),
      ]);

      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(2));
    });

    it("calls onUpload once for each successfully uploaded file", async () => {
      vi.mocked(useUploadImageMutation).mockReturnValue({
        ...defaultUploadImageMutationReturn,
        mutateAsync: vi
          .fn()
          .mockResolvedValueOnce(makeImage({ id: "img-1" }))
          .mockResolvedValueOnce(makeImage({ id: "img-2" })),
      });

      const onUpload = vi.fn();
      const { input } = setup({ multiple: true, onUpload });

      fireInputChange(input, [
        makeMockFile({ name: "a.jpg" }),
        makeMockFile({ name: "b.jpg" }),
      ]);

      await waitFor(() => expect(onUpload).toHaveBeenCalledTimes(2));
    });
  });
});
