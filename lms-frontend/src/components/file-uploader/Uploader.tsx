
import { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils"
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./Render-State";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
//import { useConstructUrl } from "@/hooks/use-construct-url";

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

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Uploader({ value, onChange }: iAppProps) {
const fileUrl = value;
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl,
  });

  
  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        key: data.data.public_id,
        objectUrl: data.data.url,
      }));

      onChange?.(data.data.public_id);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while uploading");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (fileState.uploading || fileState.objectUrl) {
        toast.error("Only one file can be uploaded at a time");
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
        fileType: "image",
      });

      uploadFile(file);
    },
    [fileState.uploading, fileState.objectUrl]
  );

  
  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      
      await new Promise((res) => setTimeout(res, 500));

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        key: undefined,
        isDeleting: false,
        error: false,
        objectUrl: undefined,
        fileType: "image",
      });

      onChange?.("");
      toast.success("File removed (soft delete)");
    } catch {
      toast.error("Error removing file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) toast.error("Too many files selected, max is 1");

      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (fileSizeToBig) toast.error("File size exceeds limit (max 2MB)");
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }
    if (fileState.error) return <RenderErrorState />;
    if (fileState.objectUrl)
      return (
        <RenderUploadedState
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          previewUrl={fileState.objectUrl}
        />
      );
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
