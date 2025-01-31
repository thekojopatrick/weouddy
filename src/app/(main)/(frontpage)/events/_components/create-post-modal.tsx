"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, Loader2, Trash2, VideoIcon, X } from "lucide-react";
import { useUploadFiles } from "@/hooks/use-upload-files";
import { useCreatePost } from "@/hooks/post/use-post";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "sonner";
import Image from "next/image";

interface CreatePostModalProps {
  open: boolean;
  eventId: string;
  onOpenChange: (open: boolean) => void;
  userName: string | null;
  userAvatar: string | null;
}

export default function CreatePostModal({
  open,
  onOpenChange,
  eventId,
  userName,
  userAvatar,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadState, handleFiles, uploadFiles, removeFile } =
    useUploadFiles();
  const createPost = useCreatePost();
  const isMobile = useMediaQuery("only screen and (max-width : 639px)");

  const Wrapper = isMobile ? Drawer : Dialog;
  const WrapperContent = isMobile ? DrawerContent : DialogContent;
  const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
  const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;

  const handleMediaSelect = async (e: any) => {
    const files = e.target.files;
    if (!files) return;
    await handleFiles(files, eventId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadState.isUploading || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const mediaFiles = await uploadFiles();

      await createPost.mutateAsync({
        content: content.trim(),
        media: mediaFiles.filter((file) => file !== null),
        eventId,
      });

      setContent("");
      onOpenChange(false);
      toast.success("Post created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent
        className={`sm:max-w-[425px] p-0 gap-0 ${isMobile ? "h-[90vh] rounded-t-lg" : "h-fit"}`}
      >
        <HeaderWrapper className="p-0">
          <div className="border-b p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <TitleWrapper className="text-sm font-semibold">
              Create New Post
            </TitleWrapper>
            <Button
              variant="secondary"
              className="font-semibold rounded-full"
              onClick={handleSubmit}
              disabled={
                uploadState.isUploading ||
                isSubmitting ||
                (!content.trim() && !uploadState.files.length)
              }
            >
              {isSubmitting || uploadState.isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </HeaderWrapper>

        <div className={`flex flex-col ${isMobile ? "h-full" : "h-[500px]"}`}>
          <div className="p-4 flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar ?? ""} />
              <AvatarFallback>{userName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm">{userName}</div>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[100px] resize-none border-none shadow-none focus-visible:ring-0 p-0 text-base"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {uploadState.files.length > 0 && (
            <div className="px-4 space-y-4">
              {uploadState.totalProgress > 0 &&
                uploadState.totalProgress < 100 && (
                  <Progress value={uploadState.totalProgress} className="h-1" />
                )}
              <div className="grid grid-cols-2 gap-2">
                {uploadState.files.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-black/5 rounded-lg overflow-hidden"
                  >
                    {file.mediaType === "IMAGE" ? (
                      <Image
                        src={file.preview}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full">
                        <video
                          src={file.preview}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                        />
                      </div>
                    )}
                    {file.progress > 0 && file.progress < 100 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                        {Math.round(file.progress)}%
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*,video/*";
                  input.onchange = handleMediaSelect;
                  input.click();
                }}
                disabled={uploadState.files.length >= 5}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              {uploadState.files.length >= 5 && (
                <span className="text-xs text-red-500">
                  Maximum 5 files allowed
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Anyone can reply
            </span>
          </div>
        </div>
      </WrapperContent>
    </Wrapper>
  );
}
