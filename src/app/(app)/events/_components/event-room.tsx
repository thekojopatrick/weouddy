'use client';

import { CalendarDays, MapPin, Settings, Users } from 'lucide-react';
import { Check, Copy } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RiCodeFill,
  RiFacebookFill,
  RiMailLine,
  RiTwitterXFill,
  RiWhatsappFill,
} from '@remixicon/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import CreatePostButton from './../_components/create-post-button';
import JoinChatRoom from './../_components/join-chat-room';
import { EventPostCard } from '@/components/post/post-card';
import { EventSettingsModal } from '@/components/event/event-settings-modal';
import { EventWithFullData, PostData } from '@/types/event';
import { Input } from '@/components/ui/input';
import React from 'react';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/formatters';
import { useAuthProtection } from '@/hooks/use-auth-protection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FeedbackDialog from '@/components/feedback-dialog';
import { useQuery } from '@tanstack/react-query';

const fetchEventPosts = async (eventId: string) => {
  const res = await fetch(`/api/events/${eventId}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export default function EventRoom({
  user,
  event,
}: {
  user:
    | (User & { username: string | null; avatarUrl: string | null })
    | null;
  event: EventWithFullData;
}) {
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

  const { data: posts } = useQuery({
    queryKey: ['posts', event.id],
    queryFn: () => fetchEventPosts(event.id),
    initialData: event.posts,
  });

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

  const handleSocialShare = (
    platform: 'twitter' | 'facebook' | 'email' | 'whatsapp'
  ) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${encodeURIComponent(event.name)}&body=${text}%0D%0A${url}`,
      whatsapp: `https://wa.me/?text=${text}:%0D%0A${url}`,
    };

    // Use proper window configurations for social media popups
    if (
      platform === 'whatsapp' &&
      /Android|iPhone/i.test(navigator.userAgent)
    ) {
      // Open in same window on mobile devices
      window.location.href = shareUrls[platform];
    } else {
      // Open popup on desktop
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

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="max-w-7xl px-6 py-6 mx-auto">
            {/* Event Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{event.name}</h1>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Share</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <div className="flex flex-col gap-3 text-center">
                        <div className="text-sm font-medium">
                          Share event
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Copy embed code"
                            onClick={() => handleCopy()}
                          >
                            <RiCodeFill
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Share on WhatsApp"
                            onClick={() =>
                              handleSocialShare('whatsapp')
                            }
                            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white hover:text-white border-[#25D366]"
                          >
                            <RiWhatsappFill
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Share on Twitter"
                            onClick={() =>
                              handleSocialShare('twitter')
                            }
                          >
                            <RiTwitterXFill
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Share on Facebook"
                            onClick={() =>
                              handleSocialShare('facebook')
                            }
                          >
                            <RiFacebookFill
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label="Share via email"
                            onClick={() => handleSocialShare('email')}
                          >
                            <RiMailLine
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              ref={inputRef}
                              className="pe-9"
                              type="text"
                              defaultValue={shareUrl}
                              aria-label="Share link"
                              readOnly
                            />
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={handleCopy}
                                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                                    aria-label={
                                      copied
                                        ? 'Copied'
                                        : 'Copy to clipboard'
                                    }
                                    disabled={copied}
                                  >
                                    <div
                                      className={cn(
                                        'transition-all',
                                        copied
                                          ? 'scale-100 opacity-100'
                                          : 'scale-0 opacity-0'
                                      )}
                                    >
                                      <Check
                                        className="stroke-emerald-500"
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div
                                      className={cn(
                                        'absolute transition-all',
                                        copied
                                          ? 'scale-0 opacity-0'
                                          : 'scale-100 opacity-100'
                                      )}
                                    >
                                      <Copy
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="px-2 py-1 text-xs">
                                  Copy to clipboard
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
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
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.members.length} Members</span>
                  <span className="text-muted-foreground">
                    {event.posts.length} posts
                  </span>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid h-auto gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts?.map((post: PostData) => (
                <EventPostCard
                  key={post.id}
                  post={post}
                  userId={user?.id as never}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Action Buttons */}
        <div
          className={cn(
            'fixed bottom-8 flex flex-col gap-4 z-50 items-end',
            isSmallDevice ? 'right-5' : 'right-8'
          )}
        >
          {/* Wrap JoinChatRoom with auth protection */}
          <div
            onClick={() =>
              protectAction(
                user,
                () => (
                  <JoinChatRoom
                    isSmallDevice={isSmallDevice}
                    eventId={event.id}
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
                    eventId={event.id}
                    user={user as never}
                  />
                ),
                'create a post'
              )
            }
          >
            <CreatePostButton
              isSmallDevice={isSmallDevice}
              eventId={event.id}
              user={{
                id: user?.id,
                userName: user?.user_metadata.full_name ?? '',
                userAvatar: user?.avatarUrl ?? '',
              }}
            />
          </div>
        </div>
        <FeedbackDialog />
        <EventSettingsModal
          event={event as never}
          isOpen={showSettings}
          onOpenChangeAction={setShowSettings}
          onSaveSettingsAction={() => {}}
        />
      </div>
    </>
  );
}
