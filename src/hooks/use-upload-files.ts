"use client";

import { FileWithPreview, UploadState } from "@/types/upload";

import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function useUploadFiles() {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    totalProgress: 0,
  });

  const handleFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    // Check if adding new files would exceed the limit
    if (uploadState.files.length + incomingFiles.length > 5) {
      //alert("You can only upload up to 5 files");

      toast.warning(
        "Please can only upload up to 5 files,Image, Videos or Gifs",
        {},
      );

      return;
    }

    // Create preview and initial state for each file
    const newFiles: FileWithPreview[] = Array.from(incomingFiles).map(
      (file) => {
        const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
        return {
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          uploading: false,
          mediaType,
        };
      },
    );

    setUploadState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const uploadFiles = async (eventId: string) => {
    setUploadState((prev) => ({ ...prev, isUploading: true }));

    const uploads = uploadState.files.map(async (fileWithPreview, index) => {
      try {
        const { file, mediaType } = fileWithPreview;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        //const filePath = `${eventId}/${fileName}`;

        // Determine storage bucket based on media type
        const filePath =
          mediaType === "VIDEO"
            ? `${eventId}/videos/${fileName}`
            : `${eventId}/images/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from("posts")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        console.log("Upload File", data);
        const {
          data: { publicUrl },
        } = supabase.storage.from("posts").getPublicUrl(filePath);

        return {
          url: publicUrl,
          type: mediaType,
          order: index,
        };
      } catch (error) {
        setUploadState((prev) => {
          const newFiles = [...prev.files];
          newFiles[index] = {
            ...newFiles[index],
            error: "Upload failed",
          };
          return { ...prev, files: newFiles };
        });
        console.error(error);
        return null;
      }
    });

    const mediaFiles = await Promise.all(uploads);
    setUploadState((prev) => ({ ...prev, isUploading: false }));
    return mediaFiles.filter(Boolean);
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
    handleFiles,
    uploadFiles,
    removeFile,
  };
}
