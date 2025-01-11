import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { extractIdentifierFromLink } from '@/lib/utils';
import { useCallback } from 'react';

interface JoinEventParams {
  identifier: string;
  pin?: string;
}

interface EventJoinResponse {
  success: boolean;
  status: 'JOINED' | 'PENDING';
  event?: {
    id: string;
    slug: string;
    accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
    requiresApproval: boolean;
  };
  error?: string;
}

export const useJoinEvent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: async ({
      identifier,
      pin,
    }: JoinEventParams): Promise<EventJoinResponse> => {
      // Add delay to prevent rapid successive calls
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await fetch('/api/events/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, pin }),
      });

      if (!res.ok) {
        const error = await res.json();
        // If it's a lock error, we can handle it gracefully
        if (error.error?.includes('already in progress')) {
          return {
            success: false,
            status: 'PENDING',
            error:
              'Please wait while your previous join request completes',
          };
        }
        throw new Error(error.error || 'Failed to join event');
      }

      return res.json();
    },
    onSuccess: (data) => {
      if (!data.success) {
        if (data.error) {
          toast.info('Please wait', {
            description: data.error,
          });
        }
        return;
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['events'] });

      if (data.status === 'PENDING') {
        toast.info('Request sent', {
          description: 'Waiting for host approval',
        });
      } else if (data.status === 'JOINED' && data.event?.slug) {
        toast.success('Successfully joined', {
          description: 'Redirecting to event page...',
        });
        setTimeout(
          () => router.push(`/events/${data.event?.slug}`),
          1000
        );
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to join', {
        description: error.message,
      });
    },
  });

  const handleJoinViaLink = useCallback(
    async (link: string) => {
      const identifier = extractIdentifierFromLink(link);
      if (!identifier) {
        toast.error('Invalid event link');
        return;
      }
      return joinMutation.mutate({ identifier });
    },
    [joinMutation]
  );

  const handleJoinViaCard = useCallback(
    async (eventId: string) => {
      return joinMutation.mutate({ identifier: eventId });
    },
    [joinMutation]
  );

  const handleJoinWithPin = useCallback(
    async (identifier: string, pin: string) => {
      return joinMutation.mutate({ identifier, pin });
    },
    [joinMutation]
  );

  return {
    joinMutation,
    handleJoinViaLink,
    handleJoinViaCard,
    handleJoinWithPin,
    isLoading: joinMutation.isPending,
  };
};
