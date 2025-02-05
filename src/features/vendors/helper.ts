import { FilterState, Vendor, VendorType } from "./types";
import { vendorsData } from "./dummy-data";

// export const generateTimeSlots = (date: Date): Availability['timeSlots'] => {
//   const slots = [];
//   for (let hour = 9; hour <= 20; hour++) {
//     slots.push({
//       start: `${hour}:00`,
//       end: `${hour + 1}:00`,
//       isAvailable: Math.random() > 0.3 // 70% chance of being available
//     });
//   }
//   return slots;
// };

// const generateAvailability = (days: number): Availability[] => {
//   return Array.from({ length: days }).map((_, index) => ({
//     date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
//     timeSlots: generateTimeSlots(new Date())
//   }));
// };

export const getVendorById = (id: string): Vendor | undefined => {
  return vendorsData.find((vendor) => vendor.id === id);
};

export const getVendorsByType = (type: Vendor["type"]): Vendor[] => {
  return vendorsData.filter((vendor) => vendor.type === type);
};

export const getVendorsByPriceRange = (
  priceRange: Vendor["priceRange"],
): Vendor[] => {
  return vendorsData.filter((vendor) => vendor.priceRange === priceRange);
};

// Helper function to get related vendors (same type, different vendor)
export const getRelatedVendors = (
  vendorId: string,
  limit: number = 3,
): Vendor[] => {
  const vendor = getVendorById(vendorId);
  if (!vendor) return [];

  return vendorsData
    .filter((v) => v.type === vendor.type && v.id !== vendor.id)
    .slice(0, limit);
};

// Helper function to get top-rated vendors
export const getTopRatedVendors = (limit: number = 5): Vendor[] => {
  return [...vendorsData].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

// Helper function to search vendors
export const searchVendors = (query: string): Vendor[] => {
  const lowercaseQuery = query.toLowerCase();
  return vendorsData.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(lowercaseQuery) ||
      vendor.services.some((service) =>
        service.toLowerCase().includes(lowercaseQuery),
      ) ||
      vendor.location?.toLowerCase().includes(lowercaseQuery),
  );
};

export const applyFilters = (vendors: Vendor[], filters: FilterState) => {
  return vendors
    .filter((vendor) => {
      // Category filter
      if (filters.category !== "All") {
        const categoryMap: { [key: string]: VendorType } = {
          Photographers: "PHOTOGRAPHER",
          Videographers: "VIDEOGRAPHER",
          Rentals: "RENTAL",
          Decor: "DECOR",
          Planners: "PLANNER",
          Venus: "VENUE",
          Cooks: "CATERER",
          Djs: "ENTERTAINMENT",
          "Hair stylist": "STYLIST",
        };
        if (vendor.type !== categoryMap[filters.category]) {
          return false;
        }
      }

      // Other existing filters
      if (
        filters.priceRange.length &&
        !filters.priceRange.includes(vendor.priceRange)
      ) {
        return false;
      }
      if (
        filters.vendorType.length &&
        !filters.vendorType.includes(vendor.type)
      ) {
        return false;
      }
      if (filters.rating && vendor.rating < filters.rating) {
        return false;
      }
      if (
        filters.location &&
        !vendor.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      if (filters.availableOnly && !vendor.isAvailable) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_low":
          return (a.packages[0]?.price || 0) - (b.packages[0]?.price || 0);
        case "price_high":
          return (b.packages[0]?.price || 0) - (a.packages[0]?.price || 0);
        case "reviews":
          return b.reviews.length - a.reviews.length;
        default:
          return b.rating - a.rating;
      }
    });
};
