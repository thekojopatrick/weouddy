"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import Image from "next/image";
import type { PortfolioItem } from "../types";

interface PortfolioDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  item: PortfolioItem | null;
}

export default function PortfolioDrawer({
  isOpen,
  onClose,
  item,
}: PortfolioDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-6">
        <DrawerHeader className="flex items-center justify-between p-0 mb-4">
          <div>
            <DrawerTitle className="text-xl font-semibold">
              {item?.title}
            </DrawerTitle>
          </div>
        </DrawerHeader>
        {item && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full max-w-[400px] rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                className="object-cover"
                fill
              />
            </div>
            <p className="text-muted-foreground">{item.description}</p>
            <div className="flex gap-2">
              <Button className="bg-black text-white hover:bg-black/90">
                Download
              </Button>
              <Button variant="outline">Share</Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
