import { EmptyState } from '@/components/ui/empty-state';
import { Search, FileQuestion } from 'lucide-react';

export function EmptyEventsSearchState() {
  return (
    <div className="grid place-content-center min-h-[60vh] w-full">
      <EmptyState
        title="No Results Found"
        description="No matches. Adjust your search terms or filters and try again."
        icons={[Search, FileQuestion]}
      />
    </div>
  );
}
