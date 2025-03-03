"use client";

import { useState, useRef, useCallback } from "react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { EmojiPicker } from "@/components/emoji-picker";
import { ImageIcon, X, NotebookPen, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useCreatePost } from "@/features/events/hooks/post/use-post";
import { useToast } from "@/hooks/use-toast";
import { uploadFiles } from "@/utils/upload-utils";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import type { FileWithPreview, UploadState } from "@/types/upload";

interface CreatePostDialogProps {
  eventId: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
}

export function CreatePostDialog({
  eventId,
  userName,
  userAvatar,
}: CreatePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    totalProgress: 0,
  });

  const createPost = useCreatePost();

  const handleOpenChange = (open: boolean) => {
    if (!open && uploadState.files.some((f) => f.uploading)) {
      setShowCloseWarning(true);
    } else if (!showCloseWarning) {
      setIsOpen(open);
    }
  };

  const handleClick = () => {
    console.log("Button clicked, setting isOpen to true");
    setIsOpen(true); // Explicitly set to true
  };

  const handleDiscard = useCallback(() => {
    console.log("Discarding post, resetting state");
    setShowCloseWarning(false);
    setIsOpen(false);
    setContent("");
    uploadState.files.forEach((file) => URL.revokeObjectURL(file.preview));
    setUploadState({
      files: [],
      isUploading: false,
      totalProgress: 0,
    });
  }, [uploadState.files]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      if (uploadState.files.length + e.target.files.length > 5) {
        toast({
          title: "Exceeded Maximum",
          description:
            "You can only upload up to 5 files (Images, Videos, or GIFs)",
          variant: "destructive",
        });
        return;
      }

      const files = Array.from(e.target.files);
      const newFiles: FileWithPreview[] = files.map((file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = file.type.startsWith("video/")
          ? `${eventId}/videos/${fileName}`
          : `${eventId}/images/${fileName}`;

        return {
          file,
          preview: URL.createObjectURL(file),
          mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          progress: 0,
          filePath,
          uploading: true, // Set to true immediately
        };
      });

      // Update state with new files and set uploading to true
      setUploadState((prev) => ({
        ...prev,
        isUploading: true,
        files: [...prev.files, ...newFiles],
      }));

      // Start uploading immediately
      try {
        const uploadedFiles = await uploadFiles(
          "posts",
          newFiles.map((f) => f.file),
          newFiles.map((f) => f.filePath!),
          (fileIndex, progress) => {
            setUploadState((prev) => ({
              ...prev,
              files: prev.files.map((file, index) =>
                prev.files.length - newFiles.length + fileIndex === index
                  ? { ...file, progress }
                  : file,
              ),
            }));
          },
        );

        // Update files with uploaded URLs
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          files: prev.files.map((file, index) => {
            // Only update the newly uploaded files
            if (index >= prev.files.length - newFiles.length) {
              const newIndex = index - (prev.files.length - newFiles.length);
              return {
                ...file,
                uploading: false,
                uploadedUrl: uploadedFiles[newIndex].url,
              };
            }
            return file;
          }),
        }));

        toast({
          title: "Upload complete",
          description: "Your files are ready to post.",
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload one or more files.",
          variant: "destructive",
        });

        // Mark files as not uploading anymore
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          files: prev.files.map((file, index) =>
            index >= prev.files.length - newFiles.length
              ? { ...file, uploading: false }
              : file,
          ),
        }));
      }
    },
    [eventId, toast, uploadFiles],
  );

  const handlePost = async () => {
    if (uploadState.isUploading) {
      toast({
        title: "Please wait",
        description: "Wait for all media to finish uploading.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      // Get the URLs of the already uploaded files
      const mediaFiles = uploadState.files.map((file, index) => ({
        url: file.uploadedUrl!, // Use the URL from the upload
        type: file.mediaType,
        order: index,
      }));

      // Create the post
      await createPost.mutateAsync({
        content: content.trim(),
        media: mediaFiles,
        eventId,
      });

      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });

      // Reset the state
      setIsOpen(false);
      setContent("");
      uploadState.files.forEach((file) => URL.revokeObjectURL(file.preview));
      setUploadState({
        files: [],
        isUploading: false,
        totalProgress: 0,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadState((prev) => {
      const newFiles = [...prev.files];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const renderContent = useCallback(
    () => (
      <>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar ?? ""} />
            <AvatarFallback>{userName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-sm">{userName}</div>
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[40px] resize-none border-none shadow-none focus-visible:ring-0 p-0 text-base"
              disabled={isPosting}
            />
          </div>
        </div>

        {uploadState.files.length > 0 && (
          <ScrollArea className="w-full whitespace-nowrap rounded-md mt-4">
            <div className="flex w-max space-x-4">
              {uploadState.files.map((file, index) => (
                <div
                  key={index}
                  className="relative shrink-0 rounded-xl overflow-hidden"
                >
                  {file.mediaType === "VIDEO" ? (
                    <video
                      src={file.preview}
                      className="h-[280px] w-[280px] object-cover"
                      controls
                    />
                  ) : (
                    <div className="h-[280px] w-[280px]">
                      <Image
                        src={file.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="object-cover"
                        fill
                      />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={() => removeFile(index)}
                    disabled={file.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {file.uploading && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                      <Progress value={file.progress} className="h-1" />
                      <p className="text-xs mt-1">
                        Uploading ({Math.round(file.progress)}%)
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*"
            />
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <EmojiPicker
              onEmojiSelectAction={(emoji) =>
                setContent((prev) => prev + emoji)
              }
            />
            <span className="text-xs text-muted-foreground">
              Anyone can reply
            </span>
          </div>
          <Button
            onClick={handlePost}
            className="bg-gray-900/80 text-white cursor-pointer rounded-full"
            disabled={
              (!content && uploadState.files.length === 0) ||
              isPosting ||
              uploadState.isUploading ||
              uploadState.files.some((file) => file.uploading)
            }
          >
            {isPosting
              ? "Posting..."
              : uploadState.isUploading
                ? "Uploading..."
                : "Post"}
          </Button>
        </div>
      </>
    ),
    [content, uploadState, isPosting, handleFileSelect, removeFile, handlePost],
  );

  // Wrapper components for mobile and desktop
  const Wrapper = isMobile ? Drawer : Dialog;
  const WrapperContent = isMobile ? DrawerContent : DialogContent;
  const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
  const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;

  return (
    <>
      <Wrapper open={isOpen} onOpenChange={handleOpenChange}>
        <Button
          variant={"default"}
          size={isMobile ? "icon" : "lg"}
          className={cn(
            "rounded-full shadow-lg bg-[#101F00] text-white",
            isMobile ? "size-12" : "h-12",
          )}
          onClick={handleClick}
        >
          {isMobile ? <NotebookPen /> : <Plus className={"size-6"} />}
          <span className={isMobile ? "sr-only" : "font-semibold"}>
            Create Post
          </span>
        </Button>
        <WrapperContent
          className={cn(
            "bg-white text-black overflow-hidden flex flex-col",
            isMobile
              ? "h-[90vh]"
              : "fixed top-[35%] left-1/2 transform -translate-x-1/2 min-h-[200px] max-h-[70vh] overflow-y-auto",
          )}
        >
          <HeaderWrapper className="flex-shrink-0">
            <TitleWrapper className="text-base font-semibold">
              New Post
            </TitleWrapper>
          </HeaderWrapper>
          <div
            className={`flex-grow overflow-y-auto ${isMobile ? "px-4" : ""}`}
          >
            {renderContent()}
          </div>
          <AlertDialog
            open={showCloseWarning}
            onOpenChange={setShowCloseWarning}
          >
            <AlertDialogContent className="bg-white border border-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Hold that thought</AlertDialogTitle>
                <AlertDialogDescription>
                  We are still uploading your media. Are you sure you want to
                  discard your post? Your draft and attachments will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setShowCloseWarning(false)}
                  className="bg-transparent border-gray-300 hover:bg-gray-100"
                >
                  Continue
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDiscard}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </WrapperContent>
      </Wrapper>
    </>
  );
}
