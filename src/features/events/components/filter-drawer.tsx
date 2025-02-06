"use client";
import { Drawer } from "vaul";

import { SlidersHorizontal } from "lucide-react";

interface FilterDrawerProps {
  categories: string[];
  locations: string[];
  currentCategory: string;
  currentLocation: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
}

const FilterDrawer = ({
  categories,
  locations = ["world", "local"],
  currentCategory,
  currentLocation,
  onCategoryChange,
  onLocationChange,
}: FilterDrawerProps) => {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger className="flex h-10 items-center justify-center gap-2 shadow-none border md:border-none rounded-sm bg-white px-4 text-sm font-medium  hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
        <SlidersHorizontal size={16} />
        <span className=" hidden md:flex transition-all ease-linear">
          Filters
        </span>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-2 right-2 top-2 z-50 w-[320px] rounded-xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <Drawer.Title className="mb-4 font-semibold">Filter by</Drawer.Title>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-3 font-medium">Location</h3>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => onLocationChange(location)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      currentLocation === location
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      currentCategory === category
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default FilterDrawer;
