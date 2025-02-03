import { EmptyState } from '@/components/ui/empty-state';
import { Search, FileQuestion } from 'lucide-react';

export function EmptyEventsSearchState() {
  return (
    <EmptyState
      title="No Results Found"
      description="No matches. Adjust your search terms or filters and try again."
      icons={[Search, FileQuestion]}
    />
  );
}
