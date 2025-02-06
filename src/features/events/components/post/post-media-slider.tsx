"use client";

import Image from "next/image";
import { MediaControls } from "./media-controls";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMediaSlider } from "../../hooks/post/use-media-slider";

interface PostMediaSliderProps {
  media: Array<{
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }>;
  alt?: string;
  isHovered: boolean;
}

export function PostMediaSlider({
  media,
  alt = "",
  isHovered,
}: PostMediaSliderProps) {
  const {
    currentMediaIndex,
    isPlaying,
    isMuted,
    videoRefs,
    handleNext,
    handlePrev,
    togglePlayPause,
    toggleMute,
  } = useMediaSlider(media, isHovered);

  const currentMedia = media[currentMediaIndex];

  return (
    <div className="relative w-full">
      <AspectRatio ratio={1 / 1.3}>
        {currentMedia.type === "IMAGE" ? (
          <Image
            src={currentMedia.url}
            alt={alt}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <video
            ref={(el) => {
              if (videoRefs.current) {
                videoRefs.current[currentMediaIndex] = el;
              }
            }}
            src={currentMedia.url}
            className="w-full h-full object-cover rounded-lg"
            muted={isMuted}
            playsInline
            onEnded={() => {
              togglePlayPause();
            }}
          />
        )}
      </AspectRatio>

      <MediaControls
        mediaCount={media.length}
        currentIndex={currentMediaIndex}
        isHovered={isHovered}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPrev={handlePrev}
        onNext={handleNext}
        onPlayPause={togglePlayPause}
        onMute={toggleMute}
        isVideo={currentMedia.type === "VIDEO"}
      />
    </div>
  );
}
