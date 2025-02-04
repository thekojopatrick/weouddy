"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const content = (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png"
          alt="Profile picture"
          width={56}
          height={56}
          className="rounded-full"
        />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Connect with Ramy Wafaa</h2>
          <p className="text-sm text-muted-foreground">Responds within a day</p>
        </div>
      </div>

      <Tabs defaultValue="message">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="message" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="message" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-details">
              Project Details <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="project-details"
              placeholder="Please describe your project, including any specific design requirements, timelines, and goals."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-date">
              Target Date <span className="text-destructive">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Please select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-week">Within 1 week</SelectItem>
                <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                <SelectItem value="1-month">Within 1 month</SelectItem>
                <SelectItem value="flexible">Flexible timeline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">
              Project Budget <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="budget"
                type="number"
                min="350"
                placeholder="Enter amount"
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum project rate is $350 (USD)
            </p>
          </div>

          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            Send Message
          </Button>
        </TabsContent>

        <TabsContent value="services">
          <div className="py-4 text-center text-muted-foreground">
            Services content coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg px-6 pb-6">
            <DrawerHeader className="flex justify-end pt-2 pb-6">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerHeader>
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
