"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmilePlus } from "lucide-react";

interface Emoji {
  emoji: string;
  name: string;
}

const allEmojis: Emoji[] = [
  { emoji: "😀", name: "grinning face" },
  { emoji: "😂", name: "face with tears of joy" },
  { emoji: "😍", name: "smiling face with heart-eyes" },
  { emoji: "🤔", name: "thinking face" },
  { emoji: "😎", name: "smiling face with sunglasses" },
  { emoji: "👍", name: "thumbs up" },
  { emoji: "❤️", name: "red heart" },
  { emoji: "🔥", name: "fire" },
  { emoji: "🎉", name: "party popper" },
  { emoji: "👏", name: "clapping hands" },
  { emoji: "🌟", name: "glowing star" },
  { emoji: "🍕", name: "pizza" },
  { emoji: "🎸", name: "guitar" },
  { emoji: "🚀", name: "rocket" },
  { emoji: "🌈", name: "rainbow" },
  { emoji: "🦄", name: "unicorn" },
  { emoji: "🍦", name: "soft ice cream" },
  { emoji: "🎭", name: "performing arts" },
  { emoji: "🌺", name: "hibiscus" },
  { emoji: "🐶", name: "dog face" },
];

interface EmojiPickerProps {
  onEmojiSelectAction: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelectAction }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEmojis = useMemo(() => {
    return allEmojis.filter(
      (emoji) =>
        emoji.name.toLowerCase().includes(search.toLowerCase()) ||
        emoji.emoji.includes(search),
    );
  }, [search]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <SmilePlus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <Input
          placeholder="Search emoji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
          {filteredEmojis.map((emoji) => (
            <Button
              key={emoji.emoji}
              variant="ghost"
              className="h-10 w-10"
              onClick={() => {
                onEmojiSelectAction(emoji.emoji);
                setIsOpen(false);
              }}
              title={emoji.name}
            >
              {emoji.emoji}
            </Button>
          ))}
        </div>
        {filteredEmojis.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            No emojis found
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
