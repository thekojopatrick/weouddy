import React from "react";
import { DashboardUserEvents } from "./user-events-list";

const EventsOverview = ({ userId }: { userId: string }) => {
  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-black text-xl font-semibold">Events</h1>
        <p className="text-gray-400 text-sm">
          Find both your joined and hosted events here
        </p>
      </div>
      <DashboardUserEvents userId={userId} />,
    </div>
  );
};

export default EventsOverview;
