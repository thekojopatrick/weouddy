'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bookmark, Clock, Globe, Package } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import PortfolioDrawer from './portfolio-drawer';
import { PortfolioItem } from '../types';
import { designers, portfolioItems } from '../dummy-data';
import ContactDialog from './contact-dialog';
import MiniProfileDrawer from './mini-profile-dialog';

export default function ProfileCard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] =
    useState<PortfolioItem | null>(null);
  const [currentDesignerIndex, setCurrentDesignerIndex] = useState(0);

  const handleImageClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handlePreviousDesigner = () => {
    setCurrentDesignerIndex((prev) =>
      prev === 0 ? designers.length - 1 : prev - 1
    );
  };

  const handleNextDesigner = () => {
    setCurrentDesignerIndex((prev) =>
      prev === designers.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16">
              <Image
                src="/placeholder.svg"
                alt="Profile picture"
                className="rounded-full object-cover"
                fill
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Ramy Wafaa</h2>
                <Badge
                  variant="default"
                  className="bg-black text-white"
                >
                  PRO
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  From $350/project
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  United Arab Emirates
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Responds within a day
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />3 Services available
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              className="bg-black text-white hover:bg-black/90"
              onClick={() => setIsContactOpen(true)}
            >
              Get in touch
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {portfolioItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="aspect-square relative rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
              >
                <Image
                  src={item.imageUrl || '/placeholder.svg'}
                  alt={item.title}
                  className="object-cover"
                  fill
                />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'character illustration',
              'ux design',
              'ui design',
              'icon design',
              'icongraphy',
              'logo design',
            ].map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
            <Button
              variant="secondary"
              className="rounded-full px-3 py-1 h-auto text-xs"
            >
              +10 skills
            </Button>
          </div>
        </CardContent>
      </Card>
      <PortfolioDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItem}
      />
      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <MiniProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        designer={designers[currentDesignerIndex]}
        onPrevious={handlePreviousDesigner}
        onNext={handleNextDesigner}
      />
    </>
  );
}
