import { EmptyState } from "@/components/ui/empty-state";
import { Search, FileQuestion } from "lucide-react";

export function EmptyEventsState() {
  return (
    <div className="grid place-content-center min-h-[60vh] w-full">
      <EmptyState
        title="No Events Available"
        description="No public or private events found. Create the first event now."
        icons={[Search, FileQuestion]}
      />
    </div>
  );
}
