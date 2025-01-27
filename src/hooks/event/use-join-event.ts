import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { extractIdentifierFromLink } from '@/lib/utils';
import { useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

interface JoinEventParams {
  identifier: string;
  pin?: string;
}

interface EventJoinResponse {
  success: boolean;
  status: 'APPROVED' | 'PENDING';
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
      console.log('Join trigger start');
      try {
        const res = await fetch('/api/events/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier, pin }),
        });

        if (!res.ok) {
          const error = await res.json();
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

        console.log('Join trigger end');
        return res.json();
      } catch (error: unknown) {
        console.log('Join event hook', { error });

        throw new Error('Unexpected error occurred');
      }
    },

    onSuccess: (data) => {
      console.log('Join event success start');

      console.log(data);

      if (!data.success) {
        if (data.error) {
          toast.info('Action in progress', {
            description: data.error,
          });
        }
        return;
      }

      if (data.status === 'PENDING') {
        toast.info('Request sent', {
          description: 'Waiting for host approval',
        });
      } else if (data.status === 'APPROVED' && data.event?.slug) {
        toast.success('Successfully joined', {
          description: 'Redirecting to event page...',
        });
        router.refresh();
      }

      queryClient.invalidateQueries({
        queryKey: ['events', data.event?.slug],
      });

      console.log('Join event success end');

      router.refresh();
    },

    onError: (error: Error) => {
      toast.error('Failed to join event', {
        description: error.message,
      });
    },
  });

  // UseRef to persist the debounced function across renders
  const debouncedJoinEvent = useRef(
    debounce((eventId: string) => {
      joinMutation.mutate({ identifier: eventId });
    }, 500)
  ).current;

  const debouncedJoinViaLink = useRef(
    debounce((link: string) => {
      const identifier = extractIdentifierFromLink(link);
      if (!identifier) {
        toast.error('Invalid event link');
        return;
      }
      joinMutation.mutate({ identifier });
    }, 500)
  ).current;

  const handleJoinViaLink = useCallback(
    (link: string) => {
      debouncedJoinViaLink(link);
    },
    [debouncedJoinViaLink]
  );

  const handleJoinViaCard = useCallback(
    (eventId: string) => {
      debouncedJoinEvent(eventId);
    },
    [debouncedJoinEvent]
  );

  const handlePinSubmit = useCallback(
    (identifier: string, pin: string) => {
      joinMutation.mutate({ identifier, pin });
    },
    [joinMutation]
  );

  return {
    joinMutation,
    handleJoinViaLink,
    handleJoinViaCard,
    handlePinSubmit,
    debouncedJoinEvent,
    debouncedJoinViaLink,
    isLoading: joinMutation.isPending,
  };
};
