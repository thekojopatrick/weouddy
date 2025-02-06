"use client";

import { Camera } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onUploadAction: (files: File[]) => void;
}

export function ImageUpload({ onUploadAction }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUploadAction(acceptedFiles);
    },
    [onUploadAction],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center aspect-square"
    >
      <input {...getInputProps()} />
      <Camera className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600 text-center">
        Select Images
        <br />
        <span className="text-gray-400">or drag photos from your computer</span>
      </p>
    </div>
  );
}
