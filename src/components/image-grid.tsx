"use client";

import Image from "next/image";

interface ImageGridProps {
  images: {
    url: string;
    progress: number;
  }[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square rounded-lg overflow-hidden"
        >
          <Image
            src={image.url}
            alt={`Uploaded image ${index + 1}`}
            fill
            className="object-cover"
          />
          {image.progress < 100 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                <svg
                  className="absolute inset-0 rotate-[-90deg]"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${image.progress * 3.14}, 1000`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  {Math.round(image.progress)}%
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
