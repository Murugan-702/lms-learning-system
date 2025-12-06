import { useCallback, useEffect, useState } from "react";
import type { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export function useUploader(
  fileTypeAccepted: "image" | "video",
  onChange?: (value: string) => void,
  value?: string
) {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    key: value,
    isDeleting: false,
    error: false,
    objectUrl: value,
    fileType: fileTypeAccepted,
  });

  // -------------------------------
  // Upload File
  // -------------------------------
  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/upload`,
          { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();

        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 100,
          key: data.data.public_id,
          objectUrl: data.data.url,
        }));

        onChange?.(data.data.url);
        toast.success("File uploaded");
      } catch (e) {
        toast.error("Upload error");
        setFileState((prev) => ({ ...prev, uploading: false, error: true }));
      }
    },
    [onChange]
  );

  // -------------------------------
  // Handle File Drop
  // -------------------------------
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (fileState.uploading || fileState.objectUrl) {
        toast.error("Only one file allowed");
        return;
      }

      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);

      setFileState({
        id: uuidv4(),
        file,
        uploading: false,
        progress: 0,
        key: undefined,
        isDeleting: false,
        error: false,
        objectUrl,
        fileType: fileTypeAccepted, // IMPORTANT FIX
      });

      uploadFile(file);
    },
    [
      fileState.uploading,
      fileState.objectUrl,
      uploadFile,
      fileTypeAccepted,
    ]
  );

  // -------------------------------
  // Handle Rejected Files
  // -------------------------------
  const rejectedFiles = (rejected: FileRejection[]) => {
    rejected.forEach((r) => toast.error(r.errors[0].message));
  };

  // -------------------------------
  // Remove File
  // -------------------------------
  const handleRemoveFile = useCallback(async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    setFileState((prev) => ({ ...prev, isDeleting: true }));

    await new Promise((res) => setTimeout(res, 600));

    if (!fileState.objectUrl.startsWith("http")) {
      URL.revokeObjectURL(fileState.objectUrl);
    }

    setFileState((prev) => ({
      ...prev,
      id: null,
      file: null,
      uploading: false,
      progress: 0,
      key: undefined,
      isDeleting: false,
      objectUrl: undefined,
    }));

    onChange?.("");
    toast.success("File removed");
  }, [fileState.objectUrl, fileState.isDeleting, onChange]);

  // -------------------------------
  // Cleanup object URL on unmount
  // -------------------------------
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return {
    fileState,
    setFileState,
    onDrop,
    rejectedFiles,
    handleRemoveFile,
  };
}
