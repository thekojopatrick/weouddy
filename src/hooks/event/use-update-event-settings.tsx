import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { EventService } from "@/server/services/event";

export function useUpdateEventSettings(eventId: string, user: User) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) =>
      EventService.updateEventSettings(eventId, user.id, settings as never),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
      toast.success("Event settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update event settings");
      console.error(error);
      throw error; // Rethrow to allow catch in caller
    },
  });
}
