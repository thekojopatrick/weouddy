'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { EventWithFullData, UserEventStatus } from '@/types/event';
import { Info, TriangleAlert, X, Loader2, Lock } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JoinEventDialog } from '@/components/event/join/join-event-dialog';
import { Container } from '@/components/common/container';

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
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkMembership = async () => {
      setIsCheckingAccess(true);
      try {
        const response = await fetch(
          `/api/events/${event.id}/status`
        );
        const data = await response.json();
        setUserStatus(data.status);

        // Show join dialog if not joined, considering PIN requirement
        if (
          (data.status === 'NOT_JOINED' &&
            event.accessType === 'PIN_REQUIRED') ||
          data.status === 'NOT_JOINED'
        ) {
          // If event requires PIN, always show dialog
          setShowJoinDialog(true);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setShowJoinDialog(true);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    if (user) {
      checkMembership();
    }
  }, [user, event.id, event.accessType]);

  if (!user) {
    return (
      <Card className="p-6 max-w-md mx-auto mt-8">
        <Alert>
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to access this event.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  if (isCheckingAccess) {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8 flex flex-col items-center justify-center shadow-none border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Verifying your access to {event.name}...
          </p>
        </Card>
      </Container>
    );
  }

  if (userStatus === 'PENDING') {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8 shadow-none border">
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
                  Your request to join &quot;{event.name}&quot; is
                  pending approval from the event host.
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
      </Container>
    );
  }

  return (
    <>
      {userStatus === 'JOINED' ? (
        children
      ) : (
        <Container>
          <Card className="p-4 max-w-lg mx-auto mt-8 shadow-none">
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex grow items-center gap-3">
                  {event.accessType === 'PIN_REQUIRED' ? (
                    <Lock
                      className="-mt-0.5 me-3 inline-flex text-amber-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <TriangleAlert
                      className="-mt-0.5 me-3 inline-flex text-amber-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex grow items-center justify-between gap-12">
                    <p className="text-sm">
                      {event.accessType === 'PIN_REQUIRED'
                        ? 'This event requires a PIN to join.'
                        : `You need to join "${event.name}" to access its content.`}
                    </p>
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
            </CardContent>
          </Card>
        </Container>
      )}

      <JoinEventDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        eventId={event.id}
        accessType={event.accessType}
        requiresApproval={event.requiresApproval}
      />
    </>
  );
}
