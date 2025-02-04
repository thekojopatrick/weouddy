"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  "All",
  "Product Design",
  "Web Design",
  "Illustration",
  "Branding",
  "Animation",
  "Mobile",
  "Typography",
  "Print",
];

const trendingTopics = [
  "landing page",
  "ux designer",
  "dashboard",
  "app design",
];

export default function Header() {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">All Vendors</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Trending:</span>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Button
                key={topic}
                variant="link"
                className="h-auto p-0 text-muted-foreground hover:text-primary"
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? "default" : "ghost"}
            className="rounded-full whitespace-nowrap"
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
            <Input className="pl-7" placeholder="Enter Budget" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Enter Location" />
          </div>
        </div>
        <div className="flex items-center gap-4 sm:min-w-[300px]">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-semibold">
              PRO
            </Badge>
            <span className="text-sm">Designers</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Switch />
            <span className="text-sm">Available for work</span>
          </div>
        </div>
      </div>
    </div>
  );
}
