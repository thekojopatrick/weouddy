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
import {
  ImageIcon,
  X,
  ImageIcon as GifIcon,
  NotebookPen,
  Plus,
} from "lucide-react";
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
import { useUploadFiles } from "@/hooks/post/use-upload-files";
import { useCreatePost } from "@/hooks/post/use-post";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostDialogProps {
  eventId: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
}

export function CreatePostDialog({
  eventId,
  userId,
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

  const { handleFiles, uploadFiles, removeFile, uploadState, setUploadState } =
    useUploadFiles();
  const createPost = useCreatePost();

  const handleOpenChange = (open: boolean) => {
    if (!open && uploadState.files.some((f) => f.uploading)) {
      setShowCloseWarning(true);
    } else if (!showCloseWarning) {
      setIsOpen(open);
    }
  };

  const handleDiscard = useCallback(() => {
    setShowCloseWarning(false);
    setIsOpen(false);
    setContent("");
    uploadState.files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [uploadState.files]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      await handleFiles(e.target.files, eventId);
    },
    [handleFiles, eventId],
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
      const mediaFiles = await uploadFiles();
      await createPost.mutateAsync({
        content: content.trim(),
        media: mediaFiles, // Pass the filtered media files
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
                    <img
                      src={file.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-[280px] w-[280px] object-cover"
                    />
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
              uploadState.isUploading
            }
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </>
    ),
    [content, uploadState, isPosting, handleFileSelect, removeFile],
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
          variant={"outline"}
          size={isMobile ? "icon" : "lg"}
          className={cn(
            "rounded-full shadow-lg",
            isMobile ? "size-12" : "h-12",
          )}
          onClick={() => setIsOpen(true)}
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
        </WrapperContent>
      </Wrapper>

      <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
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
    </>
  );
}
