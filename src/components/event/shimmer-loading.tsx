import React from 'react';

export function EventCardShimmer() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-lg overflow-hidden shadow-sm">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

export function EventListShimmer() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, index) => (
        <EventCardShimmer key={index} />
      ))}
    </div>
  );
}
