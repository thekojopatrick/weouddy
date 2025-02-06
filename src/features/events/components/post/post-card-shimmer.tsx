import React from "react";

export function PostCardShimmer() {
  return (
    <div className="border bg-card p-4 rounded-lg space-y-4 animate-pulse">
      {/* Header Shimmer */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-2 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>

      {/* Caption Shimmer */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
      </div>

      {/* Interaction Buttons Shimmer */}
      <div className="flex gap-3">
        <div className="h-5 w-10 bg-gray-300 rounded"></div>
        <div className="h-5 w-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export function PostWithMediaShimmer() {
  return (
    <div className="relative group rounded-lg overflow-hidden animate-pulse border">
      {/* Media Placeholder */}
      <div className="aspect-[1/1.3] w-full bg-gray-300"></div>

      {/* Overlay Content Shimmer */}
      <div className="absolute inset-0 bg-black/20 p-4 flex flex-col gap-2">
        <div className="flex items-start gap-2 mt-auto">
          <div className="h-8 w-8 bg-gray-400 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-400 rounded"></div>
            <div className="h-2 w-16 bg-gray-400 rounded"></div>
          </div>
        </div>

        {/* Caption Shimmer */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-400 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-400 rounded"></div>
        </div>

        {/* Interaction Icons */}
        <div className="absolute bottom-12 right-2 flex flex-col gap-2">
          <div className="p-1 rounded-full bg-black/50 h-8 w-8"></div>
          <div className="p-1 rounded-full bg-black/50 h-8 w-8"></div>
        </div>
      </div>
    </div>
  );
}
