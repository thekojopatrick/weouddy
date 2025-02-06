"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function AvatarUpload() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Avatar</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="flex gap-4">
            <Button className="gap-2 rounded-[8px]">
              <Upload className="w-4 h-4" />
              Upload photo
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Pick a photo up to 1MB.
          </p>
        </div>
      </div>
    </div>
  );
}
