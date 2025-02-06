// page.tsx
"use client";

import { useState } from "react";
import VendorCard from "./vendor-card";
import ContactDialog from "./contact-vendor-dialog";
import type { Vendor, VendorPackage } from "../types";
import { vendorsData } from "../dummy-data";

export default function VendorsPage() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleContact = async (data: {
    details: string;
    targetDate: string;
    budget: number;
  }) => {
    // Handle contact form submission
    console.log(data);
  };

  const handlePackageSelect = (pkg: VendorPackage) => {
    // Handle package selection
    console.log(pkg);
  };
  const allVendors = vendorsData;

  return (
    <div className="space-y-6">
      {allVendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onContactClick={setSelectedVendor}
          onPackageClick={handlePackageSelect}
        />
      ))}

      {selectedVendor && (
        <ContactDialog
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          vendor={selectedVendor as Vendor}
          onSubmit={handleContact}
        />
      )}
    </div>
  );
}
