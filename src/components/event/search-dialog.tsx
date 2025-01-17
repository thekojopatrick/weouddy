import {
  DialogClose,
  DialogContent,
  DialogHeader,
  MotionDialog,
} from '@/components/ui/custom-motion-dialog';
import { Loader2, Search } from 'lucide-react';

import { EventCard } from '@/components/event/event-card';
import { EventWithDetails } from '@/types/prisma.types';
import { Input } from '@/components/ui/input';
import { formatEventDateTime } from '@/lib/formatters';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useEvents } from '@/hooks/event/use-event';

export default function SearchDialog({}: {
  events?: EventWithDetails[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { events } = useEvents();

  // Filter events based on search query
  const filteredEvents = events?.filter(
    (event: EventWithDetails) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      event.location
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setIsSearching(true);
    setSearchQuery(value);
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleEventClick = (slug: string) => {
    setIsOpen(false); // Close the dialog
    router.push(`/events/${slug}`); // Navigate to the event page
  };

  return (
    <MotionDialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-md mx-auto  cursor-pointer"
      >
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="What are you looking for?"
          className="pl-8 h-[40px] shadow-none rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
          readOnly
        />
      </div>

      <DialogContent className="w-full h-screen max-w-full md:max-w-screen-md mx-auto md:h-[60vh] rounded-none md:rounded-lg">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <DialogClose className="static p-2 opacity-100 rounded-full" />
            <div className="flex-1">
              <Input
                autoFocus
                type="search"
                placeholder="Search events..."
                className="w-full rounded-full shadow-none"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
        </DialogHeader>
        <ScrollArea>
          <div className="flex-1 overflow-y-auto p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchQuery && filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  No events found for &quot;{searchQuery}&quot;
                </p>
              </div>
            ) : searchQuery ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEvents?.map((event: EventWithDetails) => {
                  const { date, time } = formatEventDateTime(
                    event.dateTime as never
                  );
                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event.slug!)}
                      className="cursor-pointer"
                    >
                      <EventCard
                        {...event}
                        date={date}
                        time={time}
                        coverImage={event.coverImage!}
                        members={event.memberCount}
                        category={event.type}
                        location={event.location!}
                        slug={event.slug!}
                        accessType={event.accessType as never}
                        description={event.description!}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Start typing to search events
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </MotionDialog>
  );
}
