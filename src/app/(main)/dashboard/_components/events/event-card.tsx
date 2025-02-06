import { EventWithDetails } from "@/types/prisma.types";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function DashboardEventCard({ event }: { event: EventWithDetails }) {
  return (
    <Link href={`/dashboard/events/${event.slug}`}>
      <Card className="shadow-none hover:shadow-md transition-shadow overflow-hidden">
        {event.coverImage && (
          <div className="relative w-full aspect-video">
            <Image
              src={event.coverImage}
              alt={event.name}
              fill
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(event.dateTime).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {event.location || "Online"}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              {event.memberCount} Members
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm">Hosted by {event.host.name}</span>

              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
