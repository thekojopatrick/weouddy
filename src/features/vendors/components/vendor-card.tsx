"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bookmark, Clock, Globe, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Vendor, VendorPackage } from "../types";

interface VendorCardProps {
  vendor: Vendor;
  onContactClick: (vendor: Vendor) => void;
  onPackageClick: (pkg: VendorPackage) => void;
}

export default function VendorCard({
  vendor,
  onContactClick,
  onPackageClick,
}: VendorCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const averageRating =
    vendor.reviews.reduce((acc, review) => acc + review.rating, 0) /
    vendor.reviews.length;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            <Image
              src={vendor.aiMetadata?.profileImage || "/placeholder.svg"}
              alt={`${vendor.name} profile picture`}
              className="rounded-full object-cover"
              fill
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">{vendor.name}</h2>
              <Badge
                variant="default"
                className={`
                ${
                  vendor.priceRange === "LUXURY"
                    ? "bg-gold text-black"
                    : vendor.priceRange === "MIDRANGE"
                      ? "bg-silver text-black"
                      : "bg-bronze text-white"
                }
              `}
              >
                {vendor.priceRange}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {vendor.packages.length} Packages Available
              </div>
              {vendor.location && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {vendor.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {averageRating.toFixed(1)} ★ ({vendor.reviews.length} reviews)
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onContactClick(vendor)}
          >
            Contact Vendor
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendor.packages.map((pkg) => (
            <Button
              key={pkg.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => onPackageClick(pkg)}
            >
              <h3 className="font-semibold">{pkg.name}</h3>
              {pkg.price && (
                <span className="text-primary">
                  From ${pkg.price.toLocaleString()}
                </span>
              )}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {vendor.services.map((service) => (
            <Badge
              key={service}
              variant="secondary"
              className="rounded-full px-3 py-1"
            >
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
