'use client';

import * as Sentry from '@sentry/nextjs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Calendar, MapPin, Share2, Users } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CustomSheet from '@/components/ui/custom-sheet';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';
import { useAccount } from '@/hooks/account/use-account';
import { useRouter } from 'next/navigation';
import { EventWithFullData } from '@/types/event';
import { getNameInitials } from '@/lib/utils';
import { JoinEventDialogViaEventCard } from './join/join-event-dialog-via-card';

interface EventModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  event: EventWithFullData;
  userStatus?: 'NOT_JOINED' | 'PENDING' | 'JOINED';
}

const EventModal = memo(
  ({
    isOpen,
    onCloseAction,
    event,
    userStatus = 'NOT_JOINED',
  }: EventModalProps) => {
    const isMobile = useMediaQuery(
      'only screen and (max-width : 638px)'
    );
    const { accountData } = useAccount();
    const router = useRouter();
    const [showJoinDialog, setShowJoinDialog] = useState(false);

    const handleShare = useCallback(async () => {
      const eventUrl = `${window.location.origin}/events/${event.slug}`;
      try {
        if (navigator.share) {
          await navigator.share({
            title: event.name,
            text: `Check out this event: ${event.name}`,
            url: eventUrl,
          });
        } else {
          throw new Error('Share API not available');
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          navigator.clipboard.writeText(eventUrl);
          toast.info('Link copied!', {
            description: 'Event link has been copied to clipboard.',
          });
        }
        Sentry.captureException(err);
      }
    }, [event.name, event.slug]);

    const handleJoinClick = useCallback(() => {
      if (!accountData?.id) {
        toast.error('Please sign in to join this event');
        router.push('/auth');
        onCloseAction();
        return;
      }
      setShowJoinDialog(true);
    }, [accountData?.id, onCloseAction, router]);

    const buttonConfig = useMemo(() => {
      switch (userStatus) {
        case 'JOINED':
          return {
            text: 'Already Joined',
            disabled: true,
            action: () => {},
          };
        case 'PENDING':
          return {
            text: 'Waiting for Approval',
            disabled: true,
            action: () => {},
          };
        default:
          const buttonText =
            event.accessType === 'PIN_REQUIRED'
              ? 'Enter PIN to Join'
              : 'Join Room';
          return {
            text: event.requiresApproval
              ? 'Request to Join'
              : buttonText,
            disabled: false,
            action: handleJoinClick,
          };
      }
    }, [
      event.accessType,
      event.requiresApproval,
      userStatus,
      handleJoinClick,
    ]);

    const renderContent = useMemo(
      () => (
        <div className="flex flex-col sm:min-h-[80vh] space-y-6 pb-4">
          <div className="relative h-48">
            <Image
              src={event.coverImage!}
              alt={event.name}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-6 space-y-6">
            <div>
              <Badge variant="secondary" className="capitalize">
                {event.type}
              </Badge>
              <h2 className="text-base md:text-xl tracking-tight font-bold mt-2 text-primary/80">
                {event.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={event.host.avatarUrl ?? undefined}
                  />
                  <AvatarFallback>
                    {getNameInitials(event?.host?.name as string)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs md:text-sm text-muted-foreground tracking-tight">
                  Hosted by {event.host.name}
                </span>
              </div>
            </div>

            {/* Event details */}
            <EventDetails event={event} />
          </div>
        </div>
      ),
      [event, handleShare]
    );

    const renderFooter = useMemo(
      () => (
        <div className="w-full space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            {userStatus === 'PENDING'
              ? 'Your request is pending approval from the host.'
              : userStatus === 'JOINED'
                ? 'You are a member of this event.'
                : 'Join this event to connect with other attendees and get updates.'}
          </p>
          <Button
            className="w-full"
            onClick={buttonConfig.action}
            disabled={buttonConfig.disabled}
          >
            {buttonConfig.text}
          </Button>
        </div>
      ),
      [buttonConfig, userStatus]
    );

    return (
      <>
        <CustomSheet
          isOpen={isOpen}
          onCloseAction={onCloseAction}
          side={isMobile ? 'bottom' : 'right'}
          title={event.name}
          content={renderContent}
          stickyHeader={true}
          stickyFooter={true}
          scrollableContent={true}
          footerContent={renderFooter}
        />
        <JoinEventDialogViaEventCard
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          eventId={event.id}
          accessType={event.accessType}
          requiresApproval={event.requiresApproval}
        />
      </>
    );
  }
);

const EventDetails = memo(
  ({
    event,
  }: {
    event: {
      date?: string;
      time?: string;
      members?: number;
      description: string;
      additionalInfo?: string;
      location: {
        name: string;
        city: string;
        country: string;
      };
    };
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Calendar className="size-[18px] text-muted-foreground self-start mt-1" />
        <div>
          <div className="font-semibold tracking-tight text-sm text-primary/80">
            {event.date}
          </div>
          <div className="text-xs text-muted-foreground">
            {event.time}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <MapPin className="size-[18px] text-muted-foreground self-start mt-1" />
        <div className="">
          <div className="font-semibold tracking-tight text-sm text-primary/80">
            {event.location.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {event.location.city}, {event.location.country}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Users className="size-[18px] text-muted-foreground" />
        <div className="font-semibold tracking-tight text-sm text-primary/80">
          {event.members ?? 0} members
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold tracking-tight text-sm">
          About event
        </h3>
        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>
      </div>

      {event.additionalInfo && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">
            Additional information
          </h3>
          <p className="text-sm text-muted-foreground">
            {event.additionalInfo}
          </p>
        </div>
      )}
    </div>
  )
);

EventDetails.displayName = 'EventDetails';
EventModal.displayName = 'EventModal';

export default EventModal;
