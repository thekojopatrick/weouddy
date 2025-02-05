"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { FilterState } from "../types";

interface MarketplaceHeaderProps {
  onBudgetChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (checked: boolean) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All",
  "Photographers",
  "Hair stylist",
  "Videographers",
  "Rentals",
  "Decor",
  "Planners",
  "Cooks",
  "Djs",
];

export function MarketplaceHeader({
  onBudgetChange,
  onLocationChange,
  availableOnly,
  onAvailableOnlyChange,
  selectedCategory,
  onCategoryChange,
}: MarketplaceHeaderProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Marketplace</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "default" : "ghost"}
            className="rounded-full whitespace-nowrap p-1 px-3"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid sm:grid-cols-2 gap-4 flex-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              className="pl-7"
              placeholder="Enter Budget"
              onChange={(e) => onBudgetChange(e.target.value)}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Enter Location"
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Switch
            checked={availableOnly}
            onCheckedChange={onAvailableOnlyChange}
          />
          <span className="text-sm">Available for work</span>
        </div>
      </div>
    </div>
  );
}
