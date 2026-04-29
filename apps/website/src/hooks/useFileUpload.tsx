import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUploadImageMutation } from "./useImages";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface FileUploadError {
  file?: File;
  message: string;
  code: "FILE_TOO_LARGE" | "INVALID_TYPE" | "TOO_MANY_FILES" | "UPLOAD_FAILED";
}

export interface FileUploadOptions {
  eventId: string;
  /**
   * Accepted MIME types or file extensions, e.g. ["image/png", ".jpg"]
   * @default ["image/*"]
   */
  accept?: string[];
  /**
   * Allow selecting multiple files at once
   * @default false
   */
  multiple?: boolean;
  /**
   * Maximum number of files. No limit if undefined
   * @default undefined
   */
  maxFiles?: number;
  /** Called on validation or upload failure */
  onError?: (error: FileUploadError) => void;
  /** Called when all queued files have finished uploading and there are no errors */
  onSuccess?: () => void;
}

export interface UseFileUploadReturn {
  status: UploadStatus;
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FileUploadError | null;
  /** Uploads the provided files */
  uploadFiles: (...files: File[]) => void;
  /** Opens the native file picker */
  openFilePicker: () => void;
  /** Reset all state back to idle */
  reset: () => void;
}

export function useFileUpload({
  eventId,
  accept = ["image/*"],
  multiple = false,
  maxFiles,
  onError,
  onSuccess,
}: FileUploadOptions): UseFileUploadReturn {
  const t = useTranslations("guest.event.upload.errors");
  const { mutateAsync: uploadImage } = useUploadImageMutation();

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<FileUploadError | null>(null);

  useEffect(() => {
    if (status === "success") {
      onSuccess?.();
    }

    if (status === "error" && error !== null) {
      onError?.(error);
    }
  }, [status, error, onError, onSuccess]);

  const makeUploadPromise = useCallback(
    (file: File) => {
      const promise = uploadImage({ eventId, file });

      promise.catch(err => {
        setStatus("error");
        setError({
          file,
          code: "UPLOAD_FAILED",
          message:
            err instanceof Error ? err.message : t("uploadFailed", { name: file.name }),
        });
      });

      return promise;
    },
    [uploadImage, eventId, t]
  );

  const uploadFiles = useCallback(
    (...files: File[]) => {
      if (files.length === 0) return;
      setStatus("uploading");
      setError(null);

      if (maxFiles !== undefined && files.length > maxFiles) {
        setStatus("error");
        setError({
          code: "TOO_MANY_FILES",
          message: t("tooManyFiles", { max: maxFiles }),
        });
        return;
      }

      Promise.all(files.map(makeUploadPromise)).then(
        () => setStatus("success"),
        () => setStatus("error")
      );
    },
    [maxFiles, t, makeUploadPromise]
  );

  const createFileInput = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept.join(",");
    input.multiple = multiple;
    input.addEventListener(
      "change",
      () => input.files !== null && uploadFiles(...input.files)
    );
    return input;
  }, [accept, multiple, uploadFiles]);

  const openFilePicker = useCallback(() => createFileInput().click(), [createFileInput]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    status,
    isUploading: status === "uploading",
    isSuccess: status === "success",
    isError: status === "error",
    error,
    uploadFiles,
    openFilePicker,
    reset,
  };
}
