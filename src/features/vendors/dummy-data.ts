import type { Designer, PortfolioItem, Vendor } from "./types";

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Character Illustrations",
    description:
      "A series of playful character illustrations showcasing modern workplace scenarios.",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Financial App Icons",
    description:
      "Custom icon set designed for a financial technology application.",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Workspace Illustrations",
    description:
      "Illustrations depicting remote work and digital collaboration.",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Tech Icons Collection",
    description: "Modern iconography for technology and software interfaces.",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Lifestyle Illustrations",
    description:
      "Contemporary illustrations showing daily life and activities.",
    imageUrl: "/placeholder.svg",
  },
];

export const services = [
  {
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    title: "Infographic illustration and animation",
    price: 5000,
    description:
      "Covering all aspects, design, concepts, illustrations, and animations, I deliver the most detailed infographics.",
    deliveryTime: "Within 2 months",
    revisions: "3 concepts, 3 revisions",
    provider: {
      name: "Jing Zhang",
      image: "/placeholder.svg",
      location: "United Kingdom",
      responseTime: "Responds quickly",
      verificationCount: 1,
    },
  },
  // Add more services as needed
];

export const designers: Designer[] = [
  {
    id: 1,
    name: "BRAND NW",
    avatar: "/placeholder.svg",
    location: "Germany",
    responseTime: "Responds quickly",
    isPro: true,
    isFeatured: true,
    projectsCompleted: 13,
    portfolioItems: [
      {
        id: 1,
        title: "More Logos & Marks",
        description: "Logo design collection 2023",
        imageUrl: "/placeholder.svg",
      },
      {
        id: 2,
        title: "Selected Logos & Marks",
        description: "Premium logo collection",
        imageUrl: "/placeholder.svg",
      },
      // Add more portfolio items as needed
    ],
  },
  // Add more designers as needed
];

export const vendorData = {
  vendors: [
    {
      id: "v1",
      name: "Grand Plaza Hotel",
      type: "VENUE",
      services: ["Wedding Ceremonies", "Corporate Events", "Banquets"],
      priceRange: "LUXURY",
      location: "123 Main St, New York, NY 10001",
      website: "https://grandplazahotel.com",
      contactEmail: "events@grandplazahotel.com",
      phone: "+1-212-555-0123",
      rating: 4.8,
      userId: "u1",
      aiMetadata: {
        tags: ["luxury", "indoor", "outdoor", "ballroom"],
        capacity: 500,
        popularFeatures: ["grand ballroom", "rooftop garden"],
      },
    },
    {
      id: "v2",
      name: "Gourmet Delights Catering",
      type: "CATERER",
      services: ["Wedding Catering", "Corporate Lunches", "Cocktail Hours"],
      priceRange: "MIDRANGE",
      location: "456 Food Ave, Brooklyn, NY 11201",
      website: "https://gourmetdelights.com",
      contactEmail: "info@gourmetdelights.com",
      phone: "+1-212-555-0124",
      rating: 4.5,
      userId: "u2",
      aiMetadata: {
        tags: [
          "international cuisine",
          "farm-to-table",
          "dietary accommodations",
        ],
        specialties: ["Mediterranean", "Asian Fusion"],
      },
    },
    {
      id: "v3",
      name: "Captured Moments Photography",
      type: "PHOTOGRAPHER",
      services: [
        "Wedding Photography",
        "Engagement Sessions",
        "Event Coverage",
      ],
      priceRange: "LUXURY",
      location: "789 Artist Row, New York, NY 10002",
      website: "https://capturedmoments.com",
      contactEmail: "book@capturedmoments.com",
      phone: "+1-212-555-0125",
      rating: 4.9,
      userId: "u3",
      aiMetadata: {
        tags: ["photojournalistic", "artistic", "candid"],
        equipment: ["Sony A1", "Canon R5"],
      },
    },
  ],

  vendorAttributes: [
    {
      id: "va1",
      vendorId: "v1",
      key: "capacity",
      value: "500",
    },
    {
      id: "va2",
      vendorId: "v1",
      key: "parking",
      value: "200 spots",
    },
    {
      id: "va3",
      vendorId: "v2",
      key: "menuType",
      value: "International",
    },
    {
      id: "va4",
      vendorId: "v2",
      key: "dietaryOptions",
      value: "Vegetarian, Vegan, Gluten-Free",
    },
    {
      id: "va5",
      vendorId: "v3",
      key: "equipment",
      value: "Professional Sony & Canon Gear",
    },
  ],

  vendorPackages: [
    {
      id: "vp1",
      vendorId: "v1",
      name: "Premium Wedding Package",
      description: "Complete wedding venue package with all amenities",
      price: 15000.0,
      inclusions: [
        "Grand Ballroom (8 hours)",
        "Bridal Suite",
        "Basic Decoration",
        "Tables and Chairs for 200 guests",
        "Basic Sound System",
      ],
    },
    {
      id: "vp2",
      vendorId: "v2",
      name: "Gold Catering Package",
      description: "Premium catering service for up to 200 guests",
      price: 12000.0,
      inclusions: [
        "5-Course Meal",
        "Wait Staff",
        "Bar Service",
        "Table Settings",
        "Setup and Cleanup",
      ],
    },
    {
      id: "vp3",
      vendorId: "v3",
      name: "Complete Wedding Photography",
      description: "Full-day wedding photography coverage",
      price: 5000.0,
      inclusions: [
        "8 Hours Coverage",
        "2 Photographers",
        "Digital Gallery",
        "500 Edited Photos",
        "Engagement Session",
      ],
    },
  ],

  vendorReviews: [
    {
      id: "vr1",
      rating: 5,
      comment: "Amazing venue! Our wedding was perfect.",
      userId: "u4",
      vendorId: "v1",
    },
    {
      id: "vr2",
      rating: 4,
      comment: "Great food and service, slightly expensive",
      userId: "u5",
      vendorId: "v2",
    },
    {
      id: "vr3",
      rating: 5,
      comment: "Captured our special moments beautifully!",
      userId: "u6",
      vendorId: "v3",
    },
  ],

  eventVendors: [
    {
      id: "ev1",
      eventId: "e1",
      vendorId: "v1",
      status: "BOOKED",
      notes: "Deposit paid, final walkthrough scheduled",
    },
    {
      id: "ev2",
      eventId: "e1",
      vendorId: "v2",
      status: "BOOKED",
      notes: "Menu tasting scheduled for next month",
    },
    {
      id: "ev3",
      eventId: "e1",
      vendorId: "v3",
      status: "PENDING",
      notes: "Awaiting portfolio review meeting",
    },
  ],
};

export const vendorsData: Vendor[] = [
  {
    id: "v1",
    name: "Grand Plaza Hotel & Convention Center",
    type: "VENUE",
    services: [
      "Wedding Ceremonies",
      "Corporate Events",
      "Conferences",
      "Galas",
      "Private Parties",
    ],
    priceRange: "LUXURY",
    location: "123 Main Street, New York, NY 10001",
    website:
      "https://avatar.vercel.sh/462cca24-8f69-48c8-aa17-40df0d7db3c3.svg",
    contactEmail: "events@grandplaza.example.com",
    phone: "+1 (212) 555-0123",
    rating: 4.8,
    userId: "u1",
    aiMetadata: {
      profileImage:
        "https://avatar.vercel.sh/462cca24-8f69-48c8-aa17-40df0d7db3c3.svg",
      amenities: ["Parking", "WiFi", "AV Equipment", "Catering Kitchen"],
      maxCapacity: 1000,
      squareFeet: 25000,
      virtualTour:
        "https://avatar.vercel.sh/462cca24-8f69-48c8-aa17-40df0d7db3c3.svg",
    },
    attributes: [
      {
        id: "va1",
        vendorId: "v1",
        key: "Capacity",
        value: "1000",
      },
      {
        id: "va2",
        vendorId: "v1",
        key: "Rooms",
        value: "5 Ballrooms, 10 Meeting Rooms",
      },
      {
        id: "va3",
        vendorId: "v1",
        key: "Parking",
        value: "300 Spaces",
      },
    ],
    packages: [
      {
        id: "vp1",
        vendorId: "v1",
        name: "Premium Wedding Package",
        description: "Complete luxury wedding package with all amenities",
        price: 25000,
        inclusions: [
          "Grand Ballroom (10 hours)",
          "Bridal Suite + Groom's Room",
          "Custom Lighting",
          "Basic Decor Package",
          "Tables and Chairs for 200 guests",
          "Basic AV Package",
          "Dedicated Event Coordinator",
          "Valet Parking for 50 cars",
        ],
      },
      {
        id: "vp2",
        vendorId: "v1",
        name: "Corporate Conference Package",
        description: "Full-day conference package with all necessities",
        price: 15000,
        inclusions: [
          "Main Conference Room (8 hours)",
          "2 Breakout Rooms",
          "AV Equipment",
          "WiFi for all attendees",
          "Morning and Afternoon Coffee Break",
          "Lunch Buffet",
          "Event Coordinator",
          "Registration Desk",
        ],
      },
    ],
    reviews: [
      {
        id: "vr1",
        rating: 5,
        comment:
          "Absolutely stunning venue! Our wedding was perfect in every way.",
        userId: "u2",
        vendorId: "v1",
      },
      {
        id: "vr2",
        rating: 4,
        comment: "Great corporate event space, professional staff.",
        userId: "u3",
        vendorId: "v1",
      },
    ],
    //availability: generateAvailability(30),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "v2",
    name: "Gourmet Delights Catering",
    type: "CATERER",
    services: [
      "Wedding Catering",
      "Corporate Catering",
      "Cocktail Receptions",
      "Private Chef Services",
      "Food Stations",
    ],
    priceRange: "MIDRANGE",
    location: "456 Kitchen Ave, Brooklyn, NY 11201",
    website: "https://gourmetdelights.example.com",
    contactEmail: "taste@gourmetdelights.example.com",
    phone: "+1 (212) 555-0124",
    rating: 4.7,
    userId: "u4",
    aiMetadata: {
      profileImage:
        "https://avatar.vercel.sh/462cca24-8f69-48c8-aa17-40df0d7db3c3.svg",
      specialties: ["Mediterranean", "Asian Fusion", "Farm-to-Table"],
      dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free", "Kosher"],
      minimumGuests: 20,
      maximumGuests: 500,
    },
    attributes: [
      {
        id: "va4",
        vendorId: "v2",
        key: "Cuisine Types",
        value: "International, Mediterranean, Asian Fusion",
      },
      {
        id: "va5",
        vendorId: "v2",
        key: "Staff",
        value: "25 Professional Staff Members",
      },
    ],
    packages: [
      {
        id: "vp3",
        vendorId: "v2",
        name: "Premium Wedding Package",
        description: "Full-service wedding catering",
        price: 175,
        inclusions: [
          "Passed Hors d'oeuvres (6 pieces per person)",
          "3-Course Plated Dinner",
          "Wine and Beer Service",
          "Coffee and Tea Service",
          "Professional Staff",
          "All Equipment and Linens",
          "Setup and Cleanup",
        ],
      },
      {
        id: "vp4",
        vendorId: "v2",
        name: "Corporate Lunch Package",
        description: "Professional lunch catering",
        price: 45,
        inclusions: [
          "Gourmet Sandwich Selection",
          "2 Side Salads",
          "Dessert Platter",
          "Soft Drinks and Water",
          "Disposable Utensils and Plates",
          "Setup",
        ],
      },
    ],
    reviews: [
      {
        id: "vr3",
        rating: 5,
        comment:
          "The food was absolutely amazing! Our guests couldn't stop raving about it.",
        userId: "u5",
        vendorId: "v2",
      },
    ],
    //availability: generateAvailability(30),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "v3",
    name: "Captured Moments Photography",
    type: "PHOTOGRAPHER",
    services: [
      "Wedding Photography",
      "Engagement Sessions",
      "Corporate Events",
      "Product Photography",
      "Aerial Photography",
    ],
    priceRange: "LUXURY",
    location: "789 Artist Row, Manhattan, NY 10013",
    website: "https://capturedmoments.example.com",
    contactEmail: "shoot@capturedmoments.example.com",
    phone: "+1 (212) 555-0125",
    rating: 4.9,
    userId: "u6",
    aiMetadata: {
      profileImage:
        "https://avatar.vercel.sh/462cca24-8f69-48c8-aa17-40df0d7db3c3.svg",
      equipment: ["Sony A1", "Canon R5", "Professional Lighting"],
      style: ["Photojournalistic", "Contemporary", "Traditional"],
      awards: ["Best Wedding Photographer 2023", "Top 10 NYC Photographers"],
    },
    attributes: [
      {
        id: "va6",
        vendorId: "v3",
        key: "Experience",
        value: "15 Years",
      },
      {
        id: "va7",
        vendorId: "v3",
        key: "Team Size",
        value: "3 Professional Photographers",
      },
    ],
    packages: [
      {
        id: "vp5",
        vendorId: "v3",
        name: "Complete Wedding Collection",
        description: "Full-day wedding photography coverage",
        price: 5000,
        inclusions: [
          "10 Hours Coverage",
          "2 Photographers",
          "Engagement Session",
          "Online Gallery",
          "High-Resolution Digital Files",
          "Wedding Album",
          "100 Prints",
          "Rights to Print",
        ],
      },
      {
        id: "vp6",
        vendorId: "v3",
        name: "Corporate Event Package",
        description: "Professional event photography",
        price: 2000,
        inclusions: [
          "4 Hours Coverage",
          "1 Photographer",
          "Online Gallery",
          "High-Resolution Digital Files",
          "Quick Turnaround",
          "Commercial Usage Rights",
        ],
      },
    ],
    reviews: [
      {
        id: "vr4",
        rating: 5,
        comment:
          "Incredible photographer! Captured every special moment perfectly.",
        userId: "u7",
        vendorId: "v3",
      },
      {
        id: "vr5",
        rating: 5,
        comment: "Professional, creative, and a joy to work with!",
        userId: "u8",
        vendorId: "v3",
      },
    ],
    //availability: generateAvailability(30),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
];
