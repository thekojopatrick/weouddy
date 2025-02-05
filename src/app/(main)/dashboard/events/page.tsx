import React from 'react';
import { EventsStatsComponent } from '../_components/events-stats';
import { getSession } from '@/lib/auth';
import EventsOverview from '../_components/events/events-overview';

const page = async () => {
  const session = await getSession();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <EventsStatsComponent />
        <EventsOverview userId={session ? session.userId : null} />
      </div>
    </div>
  );
};

export default page;
