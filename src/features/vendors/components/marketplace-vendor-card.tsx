'use client';
import { Vendor } from '../types';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorCardProps {
  vendor: Vendor;
  onBooking: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onBooking }: VendorCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{vendor.name}</h3>
        <p className="text-sm text-muted-foreground">{vendor.type}</p>
        <div className="text-sm text-muted-foreground mt-1">
          <span>{vendor.location}</span>
          {vendor.rating && (
            <span className="ml-2">★ {vendor.rating}</span>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => onBooking(vendor)}
      >
        <CalendarIcon className="h-4 w-4" />
        Book Now
      </Button>
    </div>
  );
}
