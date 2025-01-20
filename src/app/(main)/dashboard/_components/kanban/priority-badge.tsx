import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export function SuccessComponent() {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className="size-1.5 rounded-full bg-emerald-500"
        aria-hidden="true"
      ></span>
      Badge
    </Badge>
  );
}

export function WarningComponent() {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className="size-1.5 rounded-full bg-amber-500"
        aria-hidden="true"
      ></span>
      Badge
    </Badge>
  );
}

export function DangerComponent() {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className="size-1.5 rounded-full bg-red-500"
        aria-hidden="true"
      ></span>
      Badge
    </Badge>
  );
}

export function CompletedComponent() {
  return (
    <Badge variant="outline" className="gap-1.5">
      <Check
        className="text-emerald-500"
        size={12}
        strokeWidth={2}
        aria-hidden="true"
      />
      Badge
    </Badge>
  );
}
