"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { EventWithFullData } from "@/types/event";
import {
  Info,
  TriangleAlert,
  X,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JoinEventDialog } from "@/components/event/join/join-event-dialog";
import { Container } from "@/components/common/container";
import { checkUserEventStatus } from "@/app/actions/check-user-event-status";

interface EventAccessGuardProps {
  user: (User & { username: string | null; avatarUrl: string | null }) | null;
  event: EventWithFullData; // Make event nullable
  children: React.ReactNode;
  userStatus: string;
}

export default function EventAccessGuard({
  user,
  event,
  userStatus: initialUserEventStatus,
  children,
}: EventAccessGuardProps) {
  const router = useRouter();

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [userStatus, setUserStatus] = useState<string>(
    initialUserEventStatus === "APPROVED" ? "JOINED" : initialUserEventStatus,
  );
  const [isCheckingAccess, setIsCheckingAccess] = useState(
    userStatus !== "JOINED" && userStatus !== "DENIED",
  );

  useEffect(() => {
    const checkMembership = async () => {
      if (!user || user.id === event?.host?.id) return;

      setIsCheckingAccess(true);
      try {
        const updatedStatus = await checkUserEventStatus({
          eventId: event?.id || "",
          userId: user?.id || null,
          slug: event?.slug || null,
        });

        setUserStatus(updatedStatus?.status || "NOT_JOINED");

        if (
          (updatedStatus?.status === "NOT_JOINED" &&
            event?.accessType === "PIN_REQUIRED") ||
          updatedStatus?.status === "NOT_JOINED"
        ) {
          setShowJoinDialog(true);
        }
      } catch (error) {
        console.error("Error checking membership:", error);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    if (user && userStatus !== "JOINED") {
      checkMembership();
    }
  }, [
    event?.id,
    userStatus,
    event?.host?.id,
    event?.slug,
    user,
    event?.accessType,
  ]);

  // Host always gets access
  if (user?.id === event?.host.id) {
    return children;
  }

  if (!user) {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please sign in to access this event.
            </AlertDescription>
          </Alert>
        </Card>
      </Container>
    );
  }

  if (isCheckingAccess) {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8 flex flex-col items-center justify-center shadow-none border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Verifying your access to {event?.name}...
          </p>
        </Card>
      </Container>
    );
  }

  if (userStatus === "DENIED") {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access this event. Please contact
              the event host if you believe this is an error.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full mt-4"
            onClick={() => router.push("/discover")}
          >
            Back to Discover
          </Button>
        </Card>
      </Container>
    );
  }

  if (userStatus === "PENDING") {
    return (
      <Container>
        <Card className="p-6 max-w-md mx-auto mt-8 shadow-none border">
          <CardContent>
            <div className="flex gap-2">
              <Info
                className="shrink-0 text-blue-500"
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="grow">
                <p className="text-sm">
                  Your request to join &quot;{event?.name}&quot; is pending
                  approval from the event host.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You&apos;ll be notified once your request is reviewed.
                </p>
              </div>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                aria-label="Close banner"
                onClick={() => router.push("/discover")}
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
    );
  }

  return (
    <>
      {userStatus === "JOINED" ? (
        children
      ) : (
        <Container>
          <Card className="max-w-lg mx-auto mt-8 shadow-none">
            <CardContent className="pt-4 pr-3">
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                  {event?.accessType === "PIN_REQUIRED" ? (
                    <Lock
                      className="text-amber-500"
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <TriangleAlert
                      className="text-amber-500"
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center justify-between gap-12">
                    <p className="text-sm">
                      {event?.accessType === "PIN_REQUIRED"
                        ? "This event requires a PIN to join."
                        : event?.accessType === "INVITE_ONLY"
                          ? "This event requires host approval to join."
                          : `You need to join "${event?.name}" to access its content.`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                  aria-label="Close banner"
                  onClick={() => router.push("/discover")}
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
        eventId={event?.id}
        accessType={event?.accessType}
        requiresApproval={event?.requiresApproval}
        userStatus={userStatus as never}
      />
    </>
  );
}
