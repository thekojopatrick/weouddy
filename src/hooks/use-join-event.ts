import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function useJoinEvent(eventId?: string) {
  const router = useRouter();
  const { toast } = useToast();

  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/info`);
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
    enabled: !!eventId,
  });

  const joinEvent = async ({
    identifier,
    pin,
  }: {
    identifier: string;
    pin?: string;
  }) => {
    const res = await fetch('/api/events/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add cache control to prevent duplicate requests
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ identifier, pin }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to join event');
    }
    return res.json();
  };

  const joinMutation = useMutation({
    mutationFn: joinEvent,
    mutationKey: ['join-event', eventId],
    retry: false,
    onSuccess: (data) => {
      if (data.status === 'PENDING') {
        toast({
          title: 'Request Sent',
          description: 'Waiting for host approval',
        });
      } else if (data.status === 'JOINED' && data.event?.slug) {
        toast({
          title: 'Success',
          description: 'Successfully joined the event',
        });
        router.replace(`/events/${data.event.slug}`);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    eventQuery,
    joinMutation,
    isLoading: joinMutation.isPending || eventQuery.isLoading,
  };
}
