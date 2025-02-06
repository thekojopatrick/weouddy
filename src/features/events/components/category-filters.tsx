"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  onCategoryChangeAction: (category: string) => void;
  currentCategory: string;
  categories: string[];
}

export function CategoryFilters({
  onCategoryChangeAction,
  currentCategory,
  categories,
}: CategoryFiltersProps) {
  // Filter out duplicate categories and ensure 'All' is always first
  const uniqueCategories = [
    "All",
    ...new Set(categories.filter((cat) => cat !== "All")),
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2">
        {uniqueCategories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "secondary"}
            className="rounded-full capitalize"
            onClick={() => onCategoryChangeAction(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
