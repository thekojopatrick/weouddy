"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Share2,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Designer } from "../types";

interface MiniProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  designer: Designer | null;
  onPrevious: () => void;
  onNext: () => void;
}

export default function MiniProfileDrawer({
  isOpen,
  onClose,
  designer,
  onPrevious,
  onNext,
}: MiniProfileDrawerProps) {
  if (!designer) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-3xl px-6">
          <DrawerHeader className="flex justify-end pt-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>

          <div className="space-y-8 pb-6">
            {/* Profile Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="relative h-24 w-24 mx-auto">
                  <Image
                    src={designer.avatar || "/placeholder.svg"}
                    alt={designer.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {designer.isPro && (
                  <Badge className="absolute bottom-0 right-0 bg-blue-600 text-white">
                    PRO
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{designer.name}</h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{designer.location}</span>
                  <span className="text-green-600">•</span>
                  <span className="text-green-600">
                    {designer.responseTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {designer.isFeatured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-blue-600 text-blue-600" />
                    Featured
                  </Badge>
                )}
                <Badge variant="secondary">
                  {designer.projectsCompleted} Projects Completed
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Hire
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs defaultValue="work">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews (4)</TabsTrigger>
              </TabsList>

              <TabsContent value="work" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {designer.portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="py-4 text-center text-muted-foreground">
                  Services content coming soon...
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="py-4 text-center text-muted-foreground">
                  Reviews content coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation Buttons */}
          <div className="fixed bottom-6 left-6 right-6 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
              className="rounded-full bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              className="rounded-full bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
