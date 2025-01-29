"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

interface CoverUploadStepProps {
  onNext: () => void;
  onBack: () => void;
  maxSize: number;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function CoverUploadStep({
  onNext,
  onBack,
  maxSize,
  onError,
  disabled = false,
}: CoverUploadStepProps) {
  const { setValue, watch } = useFormContext();
  const coverImage = watch("coverImage");
  const [previewImage, setPreviewImage] = useState<string | null>(coverImage);
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File) => {
    // Check file size
    if (file.size > maxSize) {
      const errorMsg = `Image size (${Math.round(file.size / 1024)}KB) exceeds maximum size of ${Math.round(maxSize / 1024)}KB`;
      setError(errorMsg);
      onError(errorMsg);
      return false;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please upload a valid image file";
      setError(errorMsg);
      onError(errorMsg);
      return false;
    }

    setError(null);
    return true;
  };

  const processImage = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Additional validation for base64 size
        const base64Size = Buffer.from(
          imageDataUrl.split(",")[1],
          "base64",
        ).length;
        if (base64Size > maxSize) {
          reject(
            new Error(
              `Processed image size (${Math.round(base64Size / 1024)}KB) exceeds maximum size`,
            ),
          );
          return;
        }
        resolve(imageDataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && validateImage(file)) {
        try {
          const imageDataUrl = await processImage(file);
          setPreviewImage(imageDataUrl);
          setValue("coverImage", imageDataUrl);
          setError(null);
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "Failed to process image";
          setError(errorMsg);
          onError(errorMsg);
        }
      }
    },
    [setValue, onError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".jpg", ".webp"],
    },
    multiple: false,
    maxSize,
  });

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue("coverImage", null);
    setError(null);
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImage(file)) {
      try {
        const imageDataUrl = await processImage(file);
        setPreviewImage(imageDataUrl);
        setValue("coverImage", imageDataUrl);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to process image";
        setError(errorMsg);
        onError(errorMsg);
      }
    }
  };

  return (
    <div className="space-y-6 pb-5 md:py-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Upload Cover</h2>
        <p className="text-muted-foreground text-sm">
          Turn your gathering into a celebration and let your world shine.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        name="coverImage"
        render={({}) => (
          <FormItem>
            <FormControl>
              <div className="flex flex-col items-center gap-4">
                <div
                  {...getRootProps()}
                  className={`relative aspect-video w-full overflow-hidden rounded-lg border ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : error
                        ? "border-destructive"
                        : "border-dashed"
                  } cursor-pointer`}
                >
                  <input {...getInputProps()} />
                  {previewImage ? (
                    <>
                      <Image
                        src={previewImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isDragActive
                          ? "Drop image here"
                          : "Drag and drop or click to upload"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Maximum size: {Math.round(maxSize / 1024)}KB
                      </span>
                    </div>
                  )}
                </div>
                {!previewImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) =>
                        handleManualUpload(
                          e as unknown as React.ChangeEvent<HTMLInputElement>,
                        );
                      input.click();
                    }}
                  >
                    Choose Image
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full shadow-none"
          disabled={disabled}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!previewImage || disabled || !!error}
          className="rounded-full"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
