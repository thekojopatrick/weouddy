"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Share2, Users } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getNameInitials } from "@/lib/utils";
import EventModal from "./event-modal";
import * as Sentry from "@sentry/nextjs";
import { UserEventStatus } from "@/types/event";

interface BaseEventCardProps {
  id: string;
  name: string;
  type: string;
  coverImage: string | null;
  isPrivate: boolean;
  isDisabled: boolean;
  requiresApproval: boolean;
  accessType: "DIRECT_PASS" | "PIN_REQUIRED";
  host: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
  location: string;
  members: number;
  date: string;
  time: string;
  category?: string;
  description: string;
  additionalInfo?: string;
  slug: string | null;
  memberCount: number;
  attendeeCount: number;
}

interface EventCardProps extends BaseEventCardProps {
  userStatus?: UserEventStatus;
}

export function EventCard({
  id,
  name,
  type,
  coverImage,
  isPrivate,
  host,
  location,
  members,
  date,
  time,
  description,
  additionalInfo,
  slug,
  accessType,
  memberCount,
  attendeeCount,
  isDisabled,
  requiresApproval,
  userStatus,
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [city, country] = location.split(", ");

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventUrl = `${window.location.origin}/events/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Check out this event: ${name}`,
          url: eventUrl,
        });
      } else {
        navigator.clipboard.writeText(eventUrl);
        toast({
          title: "Link copied!",
          description: "Event link has been copied to clipboard.",
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        Sentry.captureException(err);
      }
    }
  };

  const handleCardClick = () => {
    if (userStatus === "JOINED") {
      router.push(`/events/${slug}`);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        className="group relative overflow-hidden cursor-pointer shadow-none hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-4/3">
            <Badge variant="secondary" className="absolute left-4 top-4 z-10">
              {isPrivate ? "Private" : "Public"}
            </Badge>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Image
              src={coverImage ?? "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover object-top transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
            />
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-2.5 p-4 pb-2">
          <h3 className="font-semibold text-sm leading-none tracking-tight max-w-40 truncate">
            {name}
          </h3>
          <Badge
            variant="outline"
            className="capitalize whitespace-nowrap truncate"
          >
            {type}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={host.avatarUrl!} />
                <AvatarFallback className="text-xs font-semibold">
                  {getNameInitials(host.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-xs text-zinc-950">
                  {host.name}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <MapPin className="size-3" />
                    <span className="truncate max-w-20">{location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="size-3" />
                    <span>{members}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {userStatus !== "JOINED" && (
        <EventModal
          isOpen={isModalOpen}
          onCloseAction={() => setIsModalOpen(false)}
          event={{
            id,
            name,
            type,
            coverImage: coverImage ?? "/place-holder.svg",
            host,
            date,
            time,
            location: {
              name: location,
              city: city || "Unknown",
              country: country || "Unknown",
            },
            isPrivate,
            isDisabled,
            requiresApproval,
            accessType,
            members,
            description,
            additionalInfo,
            slug,
            memberCount,
            attendeeCount,
          }}
          userStatus={userStatus}
        />
      )}
    </>
  );
}
