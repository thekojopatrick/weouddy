import { uploadToSupabase } from "@/lib/supabase/upload/supabase-storage";
import { useState } from "react";

export interface MediaFile {
  file: File;
  preview: string;
  type: "IMAGE" | "VIDEO";
  progress: number;
  uploading: boolean;
  error?: string;
}

export function useMediaUpload(maxFiles: number = 5) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    const newFiles: MediaFile[] = Array.from(files).map((file) => {
      const isVideo = file.type.startsWith("video/");

      // Validate file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        throw new Error(
          "Invalid file type. Only images and videos are allowed.",
        );
      }

      // Validate file size (e.g., 50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File too large. Maximum size is 50MB.");
      }

      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? "VIDEO" : "IMAGE",
        progress: 0,
        uploading: false,
      };
    });

    setMediaFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async (
    eventId: string,
  ): Promise<
    Array<{
      url: string;
      type: "IMAGE" | "VIDEO";
      order: number;
    } | null>
  > => {
    if (mediaFiles.length === 0) return [];

    setIsUploading(true);

    try {
      const uploadPromises = mediaFiles.map(async (mediaFile, index) => {
        // Update progress for this file
        setMediaFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index] = { ...newFiles[index], uploading: true };
          return newFiles;
        });

        try {
          const url = await uploadToSupabase(mediaFile.file, eventId);

          return {
            url,
            type: mediaFile.type,
            order: index,
          };
        } catch (error) {
          console.error("File upload failed:", error);

          // Update file status to show error
          setMediaFiles((prev) => {
            const newFiles = [...prev];
            newFiles[index] = {
              ...newFiles[index],
              uploading: false,
              error: error instanceof Error ? error.message : "Upload failed",
            };
            return newFiles;
          });

          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      setIsUploading(false);
      return results;
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  return {
    mediaFiles,
    isUploading,
    handleFileSelect,
    removeFile,
    uploadFiles,
  };
}
