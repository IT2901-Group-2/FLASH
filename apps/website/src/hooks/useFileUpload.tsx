import { useRef, useState, useCallback, ChangeEvent } from "react";
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
   * Maximum file size in bytes. No limit if undefined.
   * @default undefined
   */
  maxSizeBytes?: number;
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
}

export interface UseFileUploadReturn {
  uploadedFiles: UploadedFile[];
  status: UploadStatus;
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FileUploadError | null;
  /** Opens the native file picker */
  openFilePicker: () => void;
  /** Remove one uploaded file from the result list */
  removeFile: (fileId: string) => void;
  /** Reset all state back to idle */
  reset: () => void;
  /** A component you can render anywhere: <FileInput /> */
  FileInput: () => React.ReactElement;
}

export function useFileUpload({
  eventId,
  accept = ["image/*"],
  multiple = false,
  maxSizeBytes,
  maxFiles,
  onUpload,
  onError,
  onAllUploaded,
}: FileUploadOptions): UseFileUploadReturn {
  const t = useTranslations("guest.event.upload.errors");
  const { mutateAsync: uploadImage } = useUploadImageMutation();
  const inputRef = useRef<HTMLInputElement>(null);

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
      const oversized = maxSizeBytes ? files.find(f => f.size > maxSizeBytes) : undefined;
      if (oversized) {
        return {
          file: oversized,
          code: "FILE_TOO_LARGE",
          message: t("fileTooLarge", {
            name: oversized.name,
            max: formatBytes(maxSizeBytes!),
          }),
        };
      }

      for (const file of files) {
        if (!accept || accept.length === 0) continue;
        if (checkFileTypeValidity(file, accept)) continue;
        return {
          file,
          code: "INVALID_TYPE",
          message: t("invalidType", { name: file.name, accepted: accept.join(", ") }),
        };
      }

      return null;
    },
    [maxFiles, maxSizeBytes, t, accept]
  );

  const handleInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      e.target.value = "";

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

      files.forEach(async file => {
        await uploadImage({ eventId, file })
          .then(data => {
            const uploaded: UploadedFile = { file, data };
            results.push(uploaded);
            setUploadedFiles(prev => [...prev, uploaded]);
            onUpload?.(uploaded);
          })
          .catch(err => {
            const uploadError: FileUploadError = {
              file,
              code: "UPLOAD_FAILED",
              message:
                err instanceof Error
                  ? err.message
                  : t("uploadFailed", { name: file.name }),
            };
            setError(uploadError);
            setStatus("error");
            onError?.(uploadError);
          });
      });
      setStatus("success");
      onAllUploaded?.(results);
    },
    [validate, uploadImage, eventId, onUpload, onError, onAllUploaded, t]
  );

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  const removeFile = useCallback(
    (fileId: string) => setUploadedFiles(prev => prev.filter(f => f.data?.id !== fileId)),
    []
  );

  const reset = useCallback(() => {
    setUploadedFiles([]);
    setStatus("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const FileInput = useCallback(
    () => (
      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(",")}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleInputChange}
        data-testid="file-input"
      />
    ),
    [accept, multiple, handleInputChange]
  );

  return {
    uploadedFiles,
    status,
    isUploading: status === "uploading",
    isSuccess: status === "success",
    isError: status === "error",
    error,
    openFilePicker,
    removeFile,
    reset,
    FileInput,
  };
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
};

const checkFileTypeValidity = (file: File, accept: string[]): boolean =>
  accept.some(rule => {
    const lowerRule = rule.toLowerCase();
    if (lowerRule.startsWith(".")) return file.name.toLowerCase().endsWith(lowerRule);
    if (lowerRule.endsWith("/*")) return file.type.startsWith(lowerRule.slice(0, -1)); // "image/"
    return file.type === lowerRule;
  });
