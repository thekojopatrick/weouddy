'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { EventWithFullData, UserEventStatus } from '@/types/event';
import { Info, TriangleAlert, X } from 'lucide-react';

import { JoinEventDialogViaEventCard } from '@/components/event/join/join-event-dialog-via-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface EventAccessGuardProps {
  user:
    | (User & { username: string | null; avatarUrl: string | null })
    | null;
  event: EventWithFullData;
  children: React.ReactNode;
}

export default function EventAccessGuard({
  user,
  event,
  children,
}: EventAccessGuardProps) {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [userStatus, setUserStatus] =
    useState<UserEventStatus>('NOT_JOINED');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already a member
    const checkMembership = async () => {
      try {
        const response = await fetch(
          `/api/events/${event.id}/status`
        );
        const data = await response.json();
        setUserStatus(data.status);

        // If not joined and not pending, show join dialog
        if (data.status === 'NOT_JOINED') {
          setShowJoinDialog(true);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setShowJoinDialog(true);
      }
    };

    if (user) {
      checkMembership();
    }
  }, [user, event.id]);

  if (!user) {
    return (
      <Card className="p-6 max-w-md mx-auto mt-8">
        <Alert>
          <AlertDescription>
            Please sign in to access this event.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  if (userStatus === 'PENDING') {
    return (
      <Card className="p-6 max-w-md mx-auto mt-8">
        <Alert>
          <AlertDescription>
            <div className="flex gap-2">
              <p className="grow text-sm">
                <Info
                  className="-mt-0.5 me-3 inline-flex text-blue-500"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Your request to join this event is pending approval
                from the host.
              </p>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                aria-label="Close banner"
                onClick={() => router.push('/discover')}
              >
                <X
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <>
      {userStatus === 'JOINED' ? (
        children
      ) : (
        <Card className="p-4 max-w-lg mx-auto mt-8 shadow-none">
          <Alert>
            <div className="flex items-center gap-2">
              <div className="flex grow items-center gap-3">
                <TriangleAlert
                  className="-mt-0.5 me-3 inline-flex text-amber-500"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <div className="flex grow items-center justify-between gap-12">
                  <p className="text-sm">
                    You need to join this event to access its content.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setShowJoinDialog(true)}
                  >
                    Join Event
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                aria-label="Close banner"
                onClick={() => router.push('/discover')}
              >
                <X
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </Alert>
        </Card>
      )}

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
