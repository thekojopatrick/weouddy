import type { Designer, PortfolioItem } from "./types";

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Character Illustrations",
    description:
      "A series of playful character illustrations showcasing modern workplace scenarios.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png",
  },
  {
    id: 2,
    title: "Financial App Icons",
    description:
      "Custom icon set designed for a financial technology application.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png",
  },
  {
    id: 3,
    title: "Workspace Illustrations",
    description:
      "Illustrations depicting remote work and digital collaboration.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png",
  },
  {
    id: 4,
    title: "Tech Icons Collection",
    description: "Modern iconography for technology and software interfaces.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png",
  },
  {
    id: 5,
    title: "Lifestyle Illustrations",
    description:
      "Contemporary illustrations showing daily life and activities.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G07MTCX6YYJi40S63uPYuNdbnJLeum.png",
  },
];

export const services = [
  {
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-04%20at%2021.39.46-xquAElp6sJtgryQyZROjcglt3LnboW.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-04%20at%2021.39.46-xquAElp6sJtgryQyZROjcglt3LnboW.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-04%20at%2021.39.46-xquAElp6sJtgryQyZROjcglt3LnboW.png",
    ],
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
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vIMRKxhxKCYUqi3s2SpdENC3dQK3lG.png",
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
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vIMRKxhxKCYUqi3s2SpdENC3dQK3lG.png",
      },
      {
        id: 2,
        title: "Selected Logos & Marks",
        description: "Premium logo collection",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vIMRKxhxKCYUqi3s2SpdENC3dQK3lG.png",
      },
      // Add more portfolio items as needed
    ],
  },
  // Add more designers as needed
];
