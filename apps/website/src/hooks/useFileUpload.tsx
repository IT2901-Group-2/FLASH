import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useUploadImageMutation } from "./useImages";
import { Image } from "@/db";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  file: File;
  /** The full image object returned from the server */
  data: Image;
}

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
  /** Called for each successfully uploaded file */
  onUpload?: (uploaded: UploadedFile) => void;
  /** Called on validation or upload failure */
  onError?: (error: FileUploadError) => void;
  /** Called when all queued files have finished uploading */
  onAllUploaded?: (uploaded: UploadedFile[]) => void;
  /** Called when all queued files have finished uploading and there are no errors */
  onSuccess?: () => void;
}

export interface UseFileUploadReturn {
  uploadedFiles: UploadedFile[];
  status: UploadStatus;
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FileUploadError | null;
  /** Uploads the provided files */
  uploadFiles: (...files: File[]) => Promise<void>;
  /** Opens the native file picker */
  openFilePicker: () => void;
  /** Remove one uploaded file from the result list */
  removeFile: (fileId: string) => void;
  /** Reset all state back to idle */
  reset: () => void;
}

export function useFileUpload({
  eventId,
  accept = ["image/*"],
  multiple = false,
  maxFiles,
  onUpload,
  onError,
  onAllUploaded,
  onSuccess,
}: FileUploadOptions): UseFileUploadReturn {
  const t = useTranslations("guest.event.upload.errors");
  const { mutateAsync: uploadImage } = useUploadImageMutation();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<FileUploadError | null>(null);

  const validate = useCallback(
    (files: File[]): FileUploadError | null => {
      if (maxFiles && files.length > maxFiles)
        return {
          code: "TOO_MANY_FILES",
          message: t("tooManyFiles", { max: maxFiles }),
        };
      return null;
    },
    [maxFiles, t]
  );

  const uploadFiles = useCallback(
    async (...files: File[]) => {
      if (files.length === 0) return;

      const validationError = validate(files);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        onError?.(validationError);
        return;
      }

      setStatus("uploading");
      setError(null);

      const results: UploadedFile[] = [];

      await Promise.all(
        files.map(async file => {
          await uploadImage({ eventId, file })
            .then(data => {
              console.log("success", data);
              const uploaded: UploadedFile = { file, data };
              results.push(uploaded);
              setUploadedFiles(prev => [...prev, uploaded]);
              onUpload?.(uploaded);
            })
            .catch(err => {
              console.log("error", err);
              const uploadError: FileUploadError = {
                file,
                code: "UPLOAD_FAILED",
                message:
                  err instanceof Error
                    ? err.message
                    : t("uploadFailed", { name: file.name }),
              };
              console.log(error);
              setError(uploadError);
              setStatus("error");
              onError?.(uploadError);
            });
        })
      );
      console.log(error);
      if (!error) {
        setStatus("success");
        onAllUploaded?.(results);
        onSuccess?.();
      }
    },
    [
      validate,
      uploadImage,
      eventId,
      onUpload,
      onError,
      onAllUploaded,
      onSuccess,
      error,
      t,
    ]
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
  }, [accept, multiple]);

  const openFilePicker = useCallback(() => createFileInput().click(), []);

  const removeFile = useCallback(
    (fileId: string) => setUploadedFiles(prev => prev.filter(f => f.data?.id !== fileId)),
    []
  );

  const reset = useCallback(() => {
    setUploadedFiles([]);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    uploadedFiles,
    status,
    isUploading: status === "uploading",
    isSuccess: status === "success",
    isError: status === "error",
    error,
    uploadFiles,
    openFilePicker,
    removeFile,
    reset,
  };
}
