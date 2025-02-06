"use client";

import { useState } from "react";
import type { FileWithPreview, UploadState } from "@/types/upload";
import { toast } from "sonner";
import throttle from "lodash.throttle";
import { MediaCompressor } from "../../utils/media-compression-integration";

export function useUploadFiles() {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    totalProgress: 0,
  });

  const compressor = new MediaCompressor();

  const handleFiles = async (
    incomingFiles: FileList | null,
    eventId: string,
  ) => {
    if (!incomingFiles) return;

    if (uploadState.files.length + incomingFiles.length > 5) {
      toast.warning(
        "You can only upload up to 5 files (Images, Videos, or GIFs)",
      );
      return;
    }

    const newFiles: FileWithPreview[] = Array.from(incomingFiles).map(
      (file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploading: true,
        mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      }),
    );

    setUploadState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      isUploading: true,
    }));

    // Process files through compression pipeline
    newFiles.forEach((file, index) => {
      const fileIndex = uploadState.files.length + index;

      // Start compression
      compressor
        .processFile(file, (progress) => {
          setUploadState((prev) => {
            const newFiles = [...prev.files];
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              progress:
                progress.stage === "compressing"
                  ? progress.progress * 0.4
                  : 40 + progress.progress * 0.6,
            };
            return { ...prev, files: newFiles };
          });
        })
        .then((result) => {
          if (!result) {
            // Validation failed, remove the file from state
            setUploadState((prev) => {
              const newFiles = [...prev.files];
              URL.revokeObjectURL(newFiles[fileIndex].preview);
              newFiles.splice(fileIndex, 1);
              return {
                ...prev,
                files: newFiles,
                isUploading: newFiles.some((f) => f.uploading),
              };
            });
            return;
          }

          // After compression, start upload
          uploadFile(
            {
              ...file,
              file: result.file,
            },
            eventId,
            fileIndex,
          );

          if (result.compressed) {
            console.info(
              `Compressed ${file.file.name} by ${Math.round(
                (1 - result.file.size / file.file.size) * 100,
              )}%`,
            );
          }
        });
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

      // Throttle progress updates to improve performance
      const updateProgress = throttle((progress: number) => {
        setUploadState((prev) => {
          const newFiles = [...prev.files];
          newFiles[index] = {
            ...newFiles[index],
            progress: progress,
          };
          return { ...prev, files: newFiles };
        });
      }, 100); // Throttle to 100ms

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          updateProgress(progress);
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
