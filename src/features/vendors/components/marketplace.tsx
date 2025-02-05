"use client";
import { Vendor } from "../types";
import { useState, useCallback } from "react";
import { FilterState } from "../types";
import { FilterSection } from "./filter-section";
import { MarketplaceHeader } from "./header";
import { VendorCard } from "./marketplace-vendor-card";
import { BookingSheet } from "./booking-sheet";
import { applyFilters } from "../helper";

export default function Marketplace({ vendors }: { vendors: Vendor[] }) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    vendorType: [],
    rating: 0,
    location: "",
    availableOnly: false,
    sortBy: "rating",
    category: "All",
  });

  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVendors = useCallback(
    () => applyFilters(vendors, filters),
    [vendors, filters],
  );

  return (
    <div className="container mx-auto px-4">
      <MarketplaceHeader
        onBudgetChange={(value) => handleFilterChange("sortBy", value)}
        onLocationChange={(value) => handleFilterChange("location", value)}
        availableOnly={filters.availableOnly}
        onAvailableOnlyChange={(checked) =>
          handleFilterChange("availableOnly", checked)
        }
        selectedCategory={filters.category}
        onCategoryChange={(category) =>
          handleFilterChange("category", category)
        }
      />

      <FilterSection filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-6 space-y-4">
        {filteredVendors().map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onBooking={setBookingVendor}
          />
        ))}
      </div>

      {bookingVendor && (
        <BookingSheet
          vendor={bookingVendor}
          onClose={() => setBookingVendor(null)}
        />
      )}
    </div>
  );
}
