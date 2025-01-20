import React from 'react';
import { EventsStatsComponent } from '../_components/events-stats';
import EventsLists from '../_components/events-list';
import { getSession } from '@/lib/auth/server';

const page = async () => {
  const session = await getSession();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <EventsStatsComponent />
        <EventsLists userId={session ? session.userId : null} />
      </div>
    </div>
  );
};

export default page;
