import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { useDropzone } from "react-dropzone";
import { useUploader } from "./useUploader";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./Render-State";

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

export function Uploader({ value, onChange, fileTypeAccepted }: iAppProps) {
  const { fileState, onDrop, rejectedFiles, handleRemoveFile } =
    useUploader(fileTypeAccepted, onChange, value);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,

    // Dynamically set size limit
    maxSize:
      fileTypeAccepted === "image"
        ? 2 * 1024 * 1024 // 2MB image
        : 50 * 1024 * 1024, // 50MB video

    // Dynamically set accepted type
    accept:
      fileTypeAccepted === "image"
        ? { "image/*": [] }
        : { "video/*": [] },

    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  function renderContent() {
    if (fileState.uploading)
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );

    if (fileState.error) return <RenderErrorState />;

    if (fileState.objectUrl)
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          fileType={fileState.fileType} // more correct
        />
      );

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed w-full h-64 transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      <CardContent className="flex items-center justify-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
