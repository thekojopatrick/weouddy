'use client';

import { CalendarDays, MapPin, Settings, Users } from 'lucide-react';

import CreatePostButton from './_components/create-post-button';
import JoinChatRoom from './_components/join-chat-room';
import { EventSettingsModal } from '../settings/event-settings-modal';
import { EventWithFullData } from '@/types/event';

import React from 'react';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/utils/formatters';
import { useAuthProtection } from '@/hooks/use-auth-protection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FeedbackDialog from '@/components/feedback-dialog';

import { usePosts } from '../hooks/post/use-post';
import MasonryPosts from './_components/masonry-posts';
import ShareEventPopover from './_components/share-event';
import { Button } from '@/components/ui/button';
import { SharePlatform } from '@/types/enums';
import {
  EventSettings,
  updateEventSettings,
} from '@/app/actions/event-settings';

export default function EventRoom({
  user,
  event: initialEvent,
}: {
  user:
    | (User & { username: string | null; avatarUrl: string | null })
    | null;
  event: EventWithFullData;
}) {
  const [event, setEvent] = React.useState(initialEvent);
  const { data: posts } = usePosts(event.id, event.posts as []);

  const { date, time } = formatEventDateTime(
    event?.dateTime as never
  );
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 638px)'
  );
  const [showSettings, setShowSettings] = React.useState(false);

  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { protectAction } = useAuthProtection();

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Join me at ${event.name}!`;

  const handleSocialShare = (platform: SharePlatform) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${encodeURIComponent(event.name)}&body=${text}%0D%0A${url}`,
      whatsapp: `https://wa.me/?text=${text}:%0D%0A${url}`,
    };

    if (
      platform === 'whatsapp' &&
      /Android|iPhone/i.test(navigator.userAgent)
    ) {
      window.location.href = shareUrls[platform];
    } else {
      const width = 550;
      const height = 400;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(
        shareUrls[platform],
        'share',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    }
  };

  // Check if current user is the host
  const isHost = user?.id === event.host.id;

  const handleSaveSettings = async (
    settings: Partial<EventSettings>
  ) => {
    try {
      // Immediately update local state
      setEvent((prevEvent: EventWithFullData) => {
        return {
          ...prevEvent,
          ...settings,
        } as EventWithFullData;
      });

      await updateEventSettings(event.id, settings);
    } catch (error) {
      console.error(error);
      // Optionally revert state on error
      setEvent(initialEvent);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="max-w-7xl px-6 py-6 mx-auto">
            {/* Event Header */}
            <div className="mb-8">
              <div className="flex justify-between flex-wrap gap-3 items-start">
                <h1 className="text-xl md:text-2xl font-semibold">
                  {event.name}
                </h1>
                <div className="flex gap-2">
                  <FeedbackDialog
                    type="EVENT_EXPERIENCE"
                    title="How is your experience with the platform so far?"
                    trigger={
                      <Button
                        variant="outline"
                        className="font-semibold rounded-full"
                      >
                        Drop Feedback
                      </Button>
                    }
                  />
                  <ShareEventPopover
                    inputRef={inputRef}
                    handleCopy={handleCopy}
                    shareUrl={shareUrl}
                    copied={copied}
                    handleSocialShare={handleSocialShare}
                  />
                  {isHost && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Rest of the header content */}
              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{date}</span>
                  <span className="text-muted-foreground">
                    {time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendeeCount} Members</span>
                  <span className="text-muted-foreground">
                    {event?.posts?.length} posts
                  </span>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <MasonryPosts posts={posts} userId={user?.id as string} />
          </div>
        </main>

        {/* Action Buttons */}
        <div
          className={cn(
            'fixed bottom-8 flex flex-col gap-4 z-50 items-end',
            isSmallDevice ? 'right-5' : 'right-8'
          )}
        >
          {/*  Wrap JoinChatRoom with auth protection */}
          <div
            onClick={() =>
              protectAction(
                user,
                () => (
                  <JoinChatRoom
                    isSmallDevice={isSmallDevice}
                    eventId={event.id}
                    eventName={event.name}
                    user={user as never}
                  />
                ),
                'join chat room'
              )
            }
          >
            <JoinChatRoom
              isSmallDevice={isSmallDevice}
              eventId={event.id}
              eventName={event.name}
              user={user as never}
            />
          </div>

          {/* Wrap CreatePostButton with auth protection */}
          <div
            onClick={() =>
              protectAction(
                user,
                () => (
                  <CreatePostButton
                    isSmallDevice={isSmallDevice}
                    eventId={event.publicId}
                    user={user as never}
                  />
                ),
                'create a post'
              )
            }
          >
            <CreatePostButton
              isSmallDevice={isSmallDevice}
              eventId={event.publicId}
              user={{
                id: user?.id,
                userName: user?.user_metadata.full_name ?? '',
                userAvatar: user?.avatarUrl ?? '',
              }}
            />
          </div>
        </div>

        <EventSettingsModal
          event={event as never}
          isOpen={showSettings}
          onOpenChangeAction={setShowSettings}
          onSaveSettingsAction={handleSaveSettings}
        />
      </div>
    </>
  );
}
