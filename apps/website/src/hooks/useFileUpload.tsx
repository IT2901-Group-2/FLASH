import { useRef, ChangeEvent } from "react";

interface UseFileUploadOptions {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

/**
 * Custom hook to handle file uploads via a hidden file input.
 *
 * Provides a function to open the file picker and a component for the file input.
 *
 * @param options - Configuration options for the file upload behavior.
 * @returns An object containing the `openFilePicker` function and the `FileInput` component.
 *
 * @example
 * const { openFilePicker, FileInput } = useFileUpload({
 *   accept: "image/*",
 *   multiple: false,
 *  onFilesSelected: (files) => console.log(files[0]),
 * });
 *
 * return (<>
 *   <FileInput />
 *   <button onClick={openFilePicker}>Upload Image</button>
 * </>);
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  // Default to accepting all image types and allowing multiple file selection
  const { accept = "image/*", multiple = true, onFilesSelected } = options;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to programmatically open the file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handler for when files are selected through the file input.
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected?.(Array.from(files));
    }
    // Reset input value to allow selecting the same file again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  // Component for the hidden file input that is triggered by the openFilePicker function
  const FileInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      style={{ display: "none" }}
      onChange={handleFileChange}
      data-testid="file-input"
    />
  );

  return {
    openFilePicker,
    FileInput,
  };
}
