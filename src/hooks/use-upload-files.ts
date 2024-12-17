"use client";

import { FileWithPreview, UploadState } from "@/types/upload";

import { supabase } from "@/lib/supabase/client";
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
      alert("You can only upload up to 5 files");
      return;
    }

    // Create preview and initial state for each file
    const newFiles: FileWithPreview[] = Array.from(incomingFiles).map((
      file,
    ) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploading: false,
    }));

    setUploadState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const uploadFiles = async () => {
    setUploadState((prev) => ({ ...prev, isUploading: true }));

    const uploads = uploadState.files.map(async (fileWithPreview, index) => {
      try {
        const { file } = fileWithPreview;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from("posts")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return data.path;
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

    const paths = await Promise.all(uploads);
    setUploadState((prev) => ({ ...prev, isUploading: false }));
    return paths.filter(Boolean);
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
