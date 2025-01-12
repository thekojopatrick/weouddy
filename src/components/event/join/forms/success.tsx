import { CheckCircle, Loader2 } from 'lucide-react';

interface SuccessProps {
  isLoading?: boolean;
}

export default function Success({ isLoading = false }: SuccessProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Processing your request...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <CheckCircle className="h-8 w-8 text-green-500" />
      <p className="text-sm text-muted-foreground">
        Redirecting to event...
      </p>
    </div>
  );
}
