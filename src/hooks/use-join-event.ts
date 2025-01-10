import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function useJoinEvent(eventId?: string) {
  const router = useRouter();
  const { toast } = useToast();

  const getEventInfo = async (identifier: string) => {
    const res = await fetch(`/api/events/${identifier}/info`);
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
  };

  const joinEvent = async ({
    identifier,
    pin,
  }: {
    identifier: string;
    pin?: string;
  }) => {
    const res = await fetch('/api/events/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, pin }),
    });
    if (!res.ok) throw new Error('Failed to join event');
    return res.json();
  };

  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventInfo(eventId ?? ''),
    enabled: !!eventId,
  });

  const joinMutation = useMutation({
    mutationFn: joinEvent,
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
        router.push(`/events/${data.event.slug}`);
      }
    },
  });

  return {
    eventQuery,
    joinMutation,
    isLoading: eventQuery.isLoading || joinMutation.isPending,
  };
}
