import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EmptyEvents() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No events yet</h2>
        <p className="text-muted-foreground mb-6">
          You have no public events yet. Once you make collections
          public, they&apos;ll show up here
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            Join Event
          </Button>
        </div>
      </div>
    </div>
  );
}

export type EventType = 'all' | 'hosted' | 'joined';

export function FilterEmptyState({ type }: { type: EventType }) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">
        {type === 'hosted' ? 'No hosted events' : 'No joined events'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {type === 'hosted'
          ? "You haven't hosted any events yet. Create one to get started!"
          : "You haven't joined any events yet. Find an event to participate in!"}
      </p>
      <Button variant="secondary">
        {type === 'hosted' ? 'Create Event' : 'Find Events'}
      </Button>
    </div>
  );
}
