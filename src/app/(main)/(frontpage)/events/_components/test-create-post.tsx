"use client";

import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ImageIcon,
  Smile,
  MapPin,
  X,
  ImageIcon as GifIcon,
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
import { useUploadFiles } from "@/hooks/use-upload-files";
import { useCreatePost } from "@/hooks/post/use-post";
import { useToast } from "@/hooks/use-toast";
import { UploadState } from "@/types/upload";

interface CreatePostDialogProps {
  eventId: string;
  userId: string;
}

export function CreatePostDialog({ eventId, userId }: CreatePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Everyone
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Everyone</DropdownMenuItem>
              <DropdownMenuItem>Circle</DropdownMenuItem>
              <DropdownMenuItem>Followers</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex-1 overflow-hidden">
          <textarea
            className="w-full bg-transparent border-none focus:outline-none text-xl min-h-[120px]"
            placeholder="What is happening?!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
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
              className="text-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-blue-500">
              <GifIcon className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-blue-500">
              <Smile className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-blue-500">
              <MapPin className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={handlePost}
            className="bg-blue-500 hover:bg-blue-600 text-white"
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

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create Post
          </Button>
          <DialogContent className="sm:max-w-[600px] bg-white text-black overflow-hidden flex flex-col max-h-[80vh]">
            <DialogHeader className="flex-shrink-0">
              <h2 className="text-lg font-semibold">New Post</h2>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">{renderContent()}</div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create Post
          </Button>
          <DrawerContent className="bg-white text-black">
            <DrawerHeader className="border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold">New Post</h2>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto px-4">
              {renderContent()}
            </div>
          </DrawerContent>
        </Drawer>
      )}
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
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
