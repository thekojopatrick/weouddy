import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import React from 'react';
import { EventStatCard } from '../../_components/events/stats/event-stat-card';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Users',
    value: 356,
    type: 'total' as const,
  },
  {
    title: 'Active users',
    value: 239,
    type: 'active' as const,
  },
  {
    title: 'Return user rate',
    value: 79,
    type: 'return' as const,
  },
  {
    title: 'Complains',
    value: 2,
    type: 'fake' as const,
  },
];

const page = async ({ params }: { params: { eventId: string } }) => {
  const { eventId } = await params;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/*Header */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Event :{eventId}
            </h1>
            <p className="text-sm text-muted-foreground">
              Highlight of your events and summary
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/events/${eventId}/planner`}>
              <Button>View Planner</Button>
            </Link>
            <Button>Invite Partners</Button>
            <Button size={'icon'} variant={'outline'}>
              <Settings />
            </Button>
          </div>
        </div>
        {/* Event Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <EventStatCard key={stat.title} {...stat} />
          ))}
        </div>
        {/* Feedbacks & Complains */}
      </div>
    </div>
  );
};

export default page;
