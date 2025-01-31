"use client";

import { useState } from "react";
import type { FileWithPreview, UploadState } from "@/types/upload";
import { toast } from "sonner";

export function useUploadFiles() {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    totalProgress: 0,
  });

  const handleFiles = async (
    incomingFiles: FileList | null,
    eventId: string,
  ) => {
    if (!incomingFiles) return;

    if (uploadState.files.length + incomingFiles.length > 5) {
      toast.warning(
        "You can only upload up to 5 files (Images, Videos, or GIFs)",
        {},
      );
      return;
    }

    const newFiles: FileWithPreview[] = Array.from(incomingFiles).map(
      (file) => {
        const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
        return {
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          uploading: true,
          mediaType,
        };
      },
    );

    setUploadState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      isUploading: true,
    }));

    // Start uploading each file immediately
    newFiles.forEach((file, index) => {
      uploadFile(file, eventId, uploadState.files.length + index);
    });
  };

  const uploadFile = async (
    fileWithPreview: FileWithPreview,
    eventId: string,
    index: number,
  ) => {
    const { file, mediaType } = fileWithPreview;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath =
      mediaType === "VIDEO"
        ? `${eventId}/videos/${fileName}`
        : `${eventId}/images/${fileName}`;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/upload?path=${filePath}`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadState((prev) => {
            const newFiles = [...prev.files];
            newFiles[index] = {
              ...newFiles[index],
              progress: progress,
            };
            return { ...prev, files: newFiles };
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          const publicUrl = response.url;

          setUploadState((prev) => {
            const newFiles = [...prev.files];
            newFiles[index] = {
              ...newFiles[index],
              uploading: false,
              url: publicUrl,
            };
            return {
              ...prev,
              files: newFiles,
              isUploading: newFiles.some((f) => f.uploading),
            };
          });
        } else {
          throw new Error("Upload failed");
        }
      };

      xhr.onerror = () => {
        throw new Error("Upload failed");
      };

      xhr.send(formData);
    } catch (error) {
      setUploadState((prev) => {
        const newFiles = [...prev.files];
        newFiles[index] = {
          ...newFiles[index],
          error: "Upload failed",
          uploading: false,
        };
        return {
          ...prev,
          files: newFiles,
          isUploading: newFiles.some((f) => f.uploading),
        };
      });
      console.error(error);
      return null;
    }
  };

  const uploadFiles = async () => {
    const mediaFiles = uploadState.files
      .filter((file) => file.url)
      .map((file, index) => ({
        url: file.url!,
        type: file.mediaType,
        order: index,
      }));

    return mediaFiles;
  };

  const removeFile = (index: number) => {
    setUploadState((prev) => {
      const newFiles = [...prev.files];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  return {
    uploadState,
    setUploadState,
    handleFiles,
    uploadFiles,
    removeFile,
    uploadFile,
  };
}
