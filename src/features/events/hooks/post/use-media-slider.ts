import { useEffect, useRef, useState } from "react";

interface Media {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
}

export function useMediaSlider(media: Media[], isHovered: boolean) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current = media.map(() => null);
  }, [media]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentMediaIndex];

    if (
      isHovered &&
      currentVideo &&
      media[currentMediaIndex].type === "VIDEO"
    ) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
          video.muted = isMuted;
        }
      });

      currentVideo.play().catch((error) => {
        console.error("Autoplay was prevented:", error);
      });

      setIsPlaying(isHovered);
    } else {
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }

      setIsPlaying(false);
    }
  }, [isHovered, currentMediaIndex, media, isMuted]);

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentMediaIndex];
    if (currentVideo && media[currentMediaIndex].type === "VIDEO") {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play().catch((error) => {
          console.error("Play was prevented:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    const currentVideo = videoRefs.current[currentMediaIndex];
    if (currentVideo && media[currentMediaIndex].type === "VIDEO") {
      currentVideo.muted = !isMuted;
    }
  };

  return {
    currentMediaIndex,
    isPlaying,
    isMuted,
    videoRefs,
    handleNext,
    handlePrev,
    togglePlayPause,
    toggleMute,
  };
}
