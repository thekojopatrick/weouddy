import { User } from "@prisma/client";

export type EventActivityType =
  | "JOIN"
  | "LEAVE"
  | "POST"
  | "LIKE"
  | "COMMENT"
  | "REPORT";

export interface EventActivity {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  type: EventActivityType;
  createdAt: Date;
}

export interface EventActivityStats {
  totalActivities: number;
  activityBreakdown: {
    [key in EventActivityType]: number;
  };
  recentActivities: EventActivity[];
}
