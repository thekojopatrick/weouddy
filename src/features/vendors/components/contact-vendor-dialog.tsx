"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Vendor } from "../types";
import type { ContactFormData } from "../vaildation";
import { contactFormSchema } from "../vaildation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  onSubmit: (data: {
    details: string;
    targetDate: string;
    budget: number;
  }) => Promise<void>;
}

export default function ContactDialog({
  isOpen,
  onClose,
  vendor,
  onSubmit,
}: ContactDialogProps) {
  const [details, setDetails] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const [error, setError] = useState<string>();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      details: "",
      targetDate: "",
      budget: 350,
      guestCount: undefined,
      specialRequirements: "",
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      setError(undefined);
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Image
          src={vendor.aiMetadata?.profileImage || "/placeholder.svg"}
          alt={`${vendor.name} profile picture`}
          width={56}
          height={56}
          className="rounded-full"
        />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Contact {vendor.name}</h2>
          <p className="text-sm text-muted-foreground">
            {vendor.type} - {vendor.priceRange}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="project-details">
            Project Details <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="project-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please describe your event requirements, including date, guest count, and any specific preferences."
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-date">
            Target Date <span className="text-destructive">*</span>
          </Label>
          <Select value={targetDate} onValueChange={setTargetDate}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-month">Within 1 month</SelectItem>
              <SelectItem value="3-months">Within 3 months</SelectItem>
              <SelectItem value="6-months">Within 6 months</SelectItem>
              <SelectItem value="1-year">Within 1 year</SelectItem>
              <SelectItem value="flexible">Flexible timeline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">
            Budget <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="budget"
              type="number"
              value={budget || ""}
              onChange={(e) => setBudget(Number(e.target.value))}
              min="350"
              placeholder="Enter amount"
              className="pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum budget varies by vendor type
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg px-6 pb-6">
            <DrawerHeader className="flex justify-end pt-2 pb-6"></DrawerHeader>
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
