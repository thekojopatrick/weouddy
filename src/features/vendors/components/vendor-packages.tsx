"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { VendorPackage } from "../types";

interface VendorPackagesProps {
  packages: VendorPackage[];
  onSelect: (pkg: VendorPackage) => void;
  isLoading?: boolean;
}

export default function VendorPackages({
  packages,
  onSelect,
  isLoading,
}: VendorPackagesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-48" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pkg.price && (
              <div className="text-2xl font-bold">
                ${pkg.price.toLocaleString()}
              </div>
            )}
            <ul className="space-y-2">
              {pkg.inclusions.map((inclusion, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {inclusion}
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={() => onSelect(pkg)}>
              Select Package
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
