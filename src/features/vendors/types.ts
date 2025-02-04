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
