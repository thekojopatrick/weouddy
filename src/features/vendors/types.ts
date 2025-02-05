export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Designer {
  id: number;
  name: string;
  avatar: string;
  location: string;
  responseTime: string;
  isPro: boolean;
  isFeatured: boolean;
  projectsCompleted: number;
  portfolioItems: PortfolioItem[];
}

export interface FilterState {
  priceRange: PriceRange[];
  vendorType: VendorType[];
  rating: number;
  location: string;
  availableOnly: boolean;
  sortBy: 'rating' | 'price_low' | 'price_high' | 'reviews';
  category: string;
}

export interface Availability {
  date: Date;
  timeSlots: {
    start: string;
    end: string;
    isAvailable: boolean;
  }[];
}

export type VendorType =
  | 'VENUE'
  | 'PHOTOGRAPHER'
  | 'VIDEOGRAPHER'
  | 'RENTAL'
  | 'DECOR'
  | 'PLANNER'
  | 'CATERER'
  | 'ENTERTAINMENT'
  | 'STYLIST';

// export type VendorType =
//   | 'VENUE'
//   | 'CATERER'
//   | 'PHOTOGRAPHER'
//   | 'VIDEOGRAPHER'
//   | 'ENTERTAINMENT'
//   | 'DECOR'
//   | 'TRANSPORTATION'
//   | 'PLANNER';
export type PriceRange = 'BUDGET' | 'MIDRANGE' | 'LUXURY' | 'CUSTOM';
export type VendorStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'BOOKED'
  | 'DECLINED';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  services: string[];
  priceRange: PriceRange;
  location?: string;
  website?: string;
  contactEmail?: string;
  phone?: string;
  rating: number;
  userId: string;
  aiMetadata?: Record<string, any>;
  attributes: VendorAttribute[];
  packages: VendorPackage[];
  reviews: VendorReview[];
  isAvailable?: boolean;
  //availability?: Availability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorAttribute {
  id: string;
  vendorId: string;
  key: string;
  value: string;
}

export interface VendorPackage {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  price?: number;
  inclusions: string[];
}

export interface VendorReview {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  vendorId: string;
}
