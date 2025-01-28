import { ChevronDown } from 'lucide-react';
import React from 'react';

const AnnouncementBanner = () => {
  return (
    <div>
      {' '}
      <div className="absolute top-0 left-0 w-full bg-neutral-100 p-2 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          📢 Read.cv is winding down
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
