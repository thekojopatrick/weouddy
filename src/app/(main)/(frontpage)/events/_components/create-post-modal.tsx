"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Loader2, Trash2, VideoIcon, X } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { EmojiPicker } from "@/components/emoji-picker";
import { FileWithPreview } from "@/types/upload";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { useCreatePost } from "@/hooks/post/use-post";
import { useUploadFiles } from "@/hooks/use-upload-files";

interface CreatePostModalProps {
  open: boolean;
  eventId: string;
  onOpenChangeAction: (open: boolean) => void;
  userName: string | null;
  userAvatar: string | null;
}

export function CreatePostModal({
  open,
  eventId,
  onOpenChangeAction,
  userName,
  userAvatar,
}: CreatePostModalProps) {
  const isMobile = useMediaQuery("only screen and (max-width : 639px)");
  const createPost = useCreatePost();
  const { uploadState, handleFiles, uploadFiles, removeFile } =
    useUploadFiles();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadState.isUploading || createPost.isPending) return;

    try {
      setIsSubmitting(true);

      // Upload media files first
      const mediaFiles = await uploadFiles(eventId);

      // Filter out failed uploads
      const validMediaFiles = mediaFiles.filter(
        (
          file,
        ): file is {
          url: string;
          type: "IMAGE" | "VIDEO";
          order: number;
        } =>
          file !== null &&
          typeof file.url === "string" &&
          (file.type === "IMAGE" || file.type === "VIDEO"),
      );

      await createPost.mutateAsync({
        content: content.trim(),
        media: validMediaFiles,
        eventId,
      });

      toast.success("Post created successfully");
      setContent("");
      onOpenChangeAction(false);
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Post creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Wrapper = isMobile ? Drawer : Dialog;
  const WrapperContent = isMobile ? DrawerContent : DialogContent;
  const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
  const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;

  return (
    <Wrapper open={open} onOpenChange={onOpenChangeAction}>
      <WrapperContent
        className={`sm:max-w-[425px] p-0 gap-0 ${isMobile ? "h-screen max-h-[90vh] rounded-none" : "h-fit"}`}
        closebtnstyle="hidden"
      >
        <HeaderWrapper className="p-0">
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-ful"
              onClick={() => onOpenChangeAction(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <TitleWrapper className="text-sm">Create New Post</TitleWrapper>
            <Button
              variant="secondary"
              className="font-semibold rounded-full"
              onClick={handleSubmit}
              disabled={
                uploadState.isUploading ||
                (!content.trim() && uploadState.files.length === 0)
              }
            >
              {uploadState.isUploading || isSubmitting ? (
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
        <form onSubmit={handleSubmit} className="">
          {/* Content */}
          <div className={`flex flex-col ${isMobile ? "h-fit" : "h-[500px]"}`}>
            <div className="pt-4 px-4 flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar ?? ""} />
                <AvatarFallback>{userName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-sm">{userName}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <Textarea
              placeholder="What's happening?"
              disabled={uploadState.isUploading || isSubmitting}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full placeholder:text-sm h-full resize-none border-none focus-visible:ring-0 focus:outline-hidden bg-transparent placeholder:text-muted-foreground text-base"
            />

            {uploadState.files.length > 0 && (
              <div className="space-y-2">
                <Progress value={uploadState.totalProgress} className="h-2" />
                <div className="flex flex-wrap gap-2">
                  {uploadState.files.map(
                    (file: FileWithPreview, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square h-24 w-24"
                      >
                        {file.mediaType === "IMAGE" ? (
                          <Image
                            src={file.preview}
                            alt="Upload preview"
                            className="rounded-lg object-cover"
                            fill
                          />
                        ) : (
                          <div className="rounded-lg bg-black/20 flex items-center justify-center h-full w-full">
                            <VideoIcon className="text-white h-10 w-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                          {file.uploading ? (
                            <div className="text-white text-sm">
                              {Math.round(file.progress)}%
                            </div>
                          ) : file.error ? (
                            <div className="text-red-500 text-sm">Error</div>
                          ) : null}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-8 w-8"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="border-none rounded-full"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = "image/*,video/*";
                    input.onchange = (e) =>
                      handleFiles((e.target as HTMLInputElement).files);
                    input.click();
                  }}
                  disabled={uploadState.files.length >= 5}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <EmojiPicker
                  onEmojiSelectAction={(emoji) =>
                    setContent((prev) => prev + emoji)
                  }
                />
                {uploadState.files.length >= 5 && (
                  <span className="text-xs text-muted-foreground text-red-400">
                    Maximum 5 files allowed
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Anyone can comment
              </div>
            </div>
          </div>
        </form>
      </WrapperContent>
    </Wrapper>
  );
}
